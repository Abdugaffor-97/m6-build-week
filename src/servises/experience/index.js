const { Router } = require("express");
const ExperienceModel = require("./schema");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../../cloudinaryConfig");
const stringify = require("csv-stringify");

const router = Router();

router.get("/csv", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.find().lean();

    stringify(experience, { header: true }).pipe(res);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + "experiences" + '.csv"'
    );
  } catch (error) {
    console.error();
  }
});

router
  .route("/:profileId")
  .get(async (req, res, next) => {
    try {
      const experiences = await ExperienceModel.find({
        profileId: req.params.profileId,
      });
      ExperienceModel.find;
      res.send(experiences);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newExperience = await ExperienceModel.create({
        ...req.body,
        profileId: req.params.profileId,
      });
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
        err.message = `Experience Id: ${req.params.id} not found`;
        err.httpStatusCode = 404;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

module.exports = router;
