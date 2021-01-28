const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    text: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Profile" },
    post: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const CommentModel = model("Comment", CommentSchema);

module.exports = CommentModel;
