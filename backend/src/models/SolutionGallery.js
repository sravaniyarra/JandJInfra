const mongoose = require("mongoose");

const solutionGallerySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      enum: [
        "modular-kitchen",
        "storage-wardrobe",
        "living-space",
        "tv-units",
        "lights",
        "wall-paint",
        "bathroom",
        "kids-bedroom"
      ]
    },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    isHero: { type: Boolean, default: false }
  },
  { timestamps: true }
);

solutionGallerySchema.index({ slug: 1, createdAt: -1 });

module.exports = mongoose.model("SolutionGallery", solutionGallerySchema);
