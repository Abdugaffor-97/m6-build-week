const { writeFile } = require("fs-extra");
const PdfPrinter = require("pdfmake");
const { join } = require("path");

const buildPdfAsync = async (pdfStream) =>
  new Promise((resolve, reject) => {
    const chuncks = [];
    pdfStream.on("data", (chunk) => {
      console.log(chunk);
      chuncks.push(chunk);
    });

    pdfStream.on("error", (err) => reject(err));

    pdfStream.on("end", () => resolve(Buffer.concat(chunks)));

    pdfStream.end();
  });

const generatePdf = async (data, docDefinition) => {
  try {
    console.log(data);
    const fonts = {
      Roboto: {
        normal: "Helvetica",
      },
    };
    const printer = new PdfPrinter(fonts);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const pdfBuffer = await buildPdfAsync(pdfDoc);
    const pdfPath = join(__dirname, "LinkedInProfile.pdf");
    await writeFile(pdfPath, pdfBuffer);

    return pdfPath;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = generatePdf;
