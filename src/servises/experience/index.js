const { Router } = require("express");
const ExperienceModel = require("./schema");

const router = Router();

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
        req.body
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

module.exports = router;
