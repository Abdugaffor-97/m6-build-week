const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    text: { type: String },
    userName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Profile" },
        text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
