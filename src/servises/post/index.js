const express = require("express");
const PostModel = require("./schema");
const q2m = require("query-to-mongo");
const multer = require("multer");
const cloudinary = require("../../cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
  },
});

const cloudMulter = multer({ storage: cloudStorage });

const PostRouter = express.Router();

PostRouter.post("/", async (req, res, next) => {
  try {
    // const newPost = new PostModel(req.body);
    // const { _id } = await newPost.save();
    const newPost = await PostModel.create(req.body);
    newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

PostRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await PostModel.countDocuments(query.criteria);
    const posts = await PostModel.find(query.criteria)
      .sort({ createdAt: -1 })
      .skip(query.options.skip)
      .limit(query.options.limit)
      .populate([
        { path: "user", select: "username name surname image _id title" },
        { path: "reactions.user", select: "name surname image _id" },
      ]);
    res.send({
      links: query.links("/posts", total),
      posts,
    });
  } catch (error) {
    next(error);
  }
});

PostRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id).populate([
      { path: "user", select: "username name surname image _id title " },
      { path: "reactions.user", select: "name surname image _id" },
    ]);
    if (post) {
      res.send(post);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

PostRouter.put("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (post) {
      res.send(post);
    } else {
      const error = new Error(`Post with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

PostRouter.delete("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    if (post) {
      res.send("Deleted");
    } else {
      const error = new Error(`Post with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

PostRouter.route("/:id/postPicture").post(
  cloudMulter.single("post"),
  async (req, res, next) => {
    try {
      const addPicture = await PostModel.findByIdAndUpdate(req.params.id, {
        $set: {
          image: req.file.path,
        },
      });
      console.log("hello");
      if (addPicture) {
        res.status(200).send("posted");
      } else {
        const err = new Error();
        err.message = `Post Id: ${req.params.id} not found`;
        err.httpStatusCode = 404;
        next(err);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

PostRouter.post("/:postId/:userId/addReaction", async (req, res, next) => {
  try {
    const isReactionThere = await PostModel.findOne({
      _id: req.params.postId,
      "reactions.user": req.params.userId,
    });

    console.log(isReactionThere);
    if (isReactionThere) {
      const modifyReaction = await PostModel.findOneAndUpdate(
        {
          _id: req.params.postId,
          "reactions.user": req.params.userId,
        },
        {
          "reactions.$.reaction": req.body.reaction,
        }
      );
      res.status(200).send(modifyReaction);
    } else {
      const newReaction = await PostModel.findByIdAndUpdate(req.params.postId, {
        $push: { reactions: { ...req.body, user: req.params.userId } },
      });
      res.status(201).send(newReaction);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

PostRouter.delete("/:postId/:userId/removeReaction", async (req, res, next) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          reactions: {
            user: mongoose.Types.ObjectId(req.params.userId),
          },
        },
      },
      { runValidators: true, new: true }
    );
    res.status(203).send("Reaction is removed");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = PostRouter;
