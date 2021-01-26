const { Router } = require("express");
const ExperienceModel = require("./schema");
const fs = require("fs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../../cloudinaryConfig");
const { pipeline } = require("stream");
const { Transform, parse, AsyncParser } = require("json2csv");
const { createReadStream } = require("fs-extra");
const { join } = require("path");

const router = Router();

router.get("/csv", async (req, res, next) => {
  try {
    let data = await ExperienceModel.find();
    console.log(data);

    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(data);
    fs.writeFile("bezkoder_mongodb_fs.csv", csvData, function (error) {
      if (error) throw error;
      console.log("Write to bezkoder_mongodb_fs.csv successfully!");
    });
  } catch (error) {
    console.error();
  }
});

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const experiences = await ExperienceModel.find();
      ExperienceModel.find;
      res.send(experiences);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newExperience = await ExperienceModel.create(req.body);
      newExperience.save();
      res.send(newExperience);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    const experience = await ExperienceModel.findById(req.params.id);
    res.send(experience);
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const experience = await ExperienceModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { runValidators: true, new: true }
      );
      res.send(experience);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const experience = await ExperienceModel.findByIdAndDelete(req.params.id);
      res.status(202).send(experience);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "experiences",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

router
  .route("/:id/pictute")
  .post(cloudMulter.single("experience"), async (req, res, next) => {
    try {
      const addPicture = await ExperienceModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            image: req.file.path,
          },
        }
      );
      if (addPicture) {
        res.status(200).send(addPicture);
      } else {
        const err = new Error();
        err.message = `Profile Id: ${req.params.id} not found`;
        err.httpStatusCode = 404;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

module.exports = router;
