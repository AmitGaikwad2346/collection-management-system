const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
