const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png",
    },
    username: { type: String, required: true, unique: true, dropDups: true },
  },
  { timestamps: true }
);

const ProfileModel = model("Profile", ProfileSchema);

module.exports = ProfileModel;
