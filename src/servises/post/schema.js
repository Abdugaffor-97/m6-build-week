const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    text: { type: String},
    userName: { type: String},
    user:{type:Schema.Types.ObjectId, ref:'Profile'},
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema)

module.exports = PostModel;