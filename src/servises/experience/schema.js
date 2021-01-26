const { Schema, model } = require("mongoose");

const ExperienceSchema = new Schema({
  role: { type: String, required: true },
  company: { type: String, default: "Google" },
  startDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date, default: null },
  description: { type: String },
  area: { type: String },
  image: {
    type: String,
    default:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  },
  profileId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = model("experience", ExperienceSchema);
