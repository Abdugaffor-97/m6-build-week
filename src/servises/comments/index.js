const { Router } = require("express");
const CommentModel = require("./schema");
const mongoose = require("mongoose");

const router = Router();

router
  .route("/:postId")
  .get(async (req, res, next) => {
    try {
      const comments = await CommentModel.find({
        post: req.params.postId,
      }).populate({
        path: "user",
        select: "_id name surname image username title",
      });

      res.send(comments);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newComment = await CommentModel.create({
        ...req.body,
        post: mongoose.Types.ObjectId(req.params.postId),
      });
      newComment.save();
      res.send(newComment);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    const comment = await CommentModel.findById(req.params.id);
    res.send(comment);
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const comment = await CommentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { runValidators: true, new: true }
      );
      res.send(comment);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const comment = await CommentModel.findByIdAndDelete(req.params.id);
      res.status(202).send(comment);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

module.exports = router;
