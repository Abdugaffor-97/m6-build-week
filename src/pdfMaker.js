const { writeFile } = require("fs-extra");
const PdfPrinter = require("pdfmake");
const { join } = require("path");

const buildPdfAsync = async (pdfStream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    pdfStream.on("data", (chunk) => {
      //   console.log(chunk);
      chunks.push(chunk);
    });

    pdfStream.on("error", (err) => reject(err));

    pdfStream.on("end", () => resolve(Buffer.concat(chunks)));

    pdfStream.end();
  });

const generatePdf = (docDefinition) => {
  try {
    // console.log(data);
    const fonts = {
      Roboto: {
        normal: "Helvetica",
      },
    };
    const printer = new PdfPrinter(fonts);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    /**
     * 
     * const pdfBuffer = await buildPdfAsync(pdfDoc);
    const pdfPath = join(__dirname, "../public/LinkedInProfile.pdf");

    await writeFile(pdfPath, pdfBuffer);

     */
    return pdfDoc;
  } catch (error) {
    console.log(error);
  }
};

module.exports = generatePdf;
