const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    text: { type: String, required: true },
    userName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    image: { type: String },
    reactions: [
      {
        _id: false,
        user: { type: Schema.Types.ObjectId, ref: "Profile" },
        reaction: Number,
      },
    ],
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
