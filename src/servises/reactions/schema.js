const { Schema, model } = require("mongoose");

const ReactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Profile" },
  reaction: Number,
});

const ReactionModel = model("Reaction", ReactionSchema);

module.exports = ReactionModel;
