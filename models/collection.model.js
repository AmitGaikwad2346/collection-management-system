const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recommendation",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
