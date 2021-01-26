const { Schema, model } = require("mongoose");
const ProfileModel = require("../profile/schema")

const PostSchema = new Schema(

  {
    text: { type: String},
    userName: {type: String},
    user:{type:Schema.Types.ObjectId, ref:'Profile'},
    image: {
        type: String,
        default:
          "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png",
      }
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema)

module.exports = PostModel;