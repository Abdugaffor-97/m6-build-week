const { Schema, model } = require("mongoose");

const ExperienceSchema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  description: { type: String },
  area: { type: String },
  username: { type: String },
  image: { type: String },
});

module.exports = model("experience", ExperienceSchema);
