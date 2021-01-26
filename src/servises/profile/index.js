const express = require("express");
const ProfileModel = require("./schema");
const multer = require("multer");
const cloudinary = require("../../cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profiles",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const profiles = await ProfileModel.find();
      res.status(200).send(profiles);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newProfile = new ProfileModel(req.body);
      const { _id } = await newProfile.save();
      res.status(201).send(_id);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const profile = await ProfileModel.findById(req.params.id);
      if (profile) {
        res.status(200).send(profile);
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
  })
  .put(async (req, res, next) => {
    try {
      const modifiedProfile = await ProfileModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { runValidators: true, new: true }
      );
      if (modifiedProfile) {
        res.status(200).send(modifiedProfile);
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
  })
  .delete(async (req, res, next) => {
    try {
      const deletedProfile = await ProfileModel.findByIdAndDelete(
        req.params.id
      );
      if (deletedProfile) {
        res.status(200).send(deletedProfile);
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

router
  .route("/:id/picture")
  .post(cloudMulter.single("profile"), async (req, res, next) => {
    try {
      const addPicture = await ProfileModel.findByIdAndUpdate(req.params.id, {
        $set: {
          image: req.file.path,
        },
      });
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
router.route("/:id/CV").get(async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
