const asyncHandler = require("../utils/asyncHandler");
const SolutionGallery = require("../models/SolutionGallery");
const { uploadSingleMedia } = require("../utils/mediaUpload");

const getBySlug = asyncHandler(async (req, res) => {
  const images = await SolutionGallery.find({ slug: req.params.slug }).sort({ isHero: -1, createdAt: -1 });
  res.json(images);
});

const upload = asyncHandler(async (req, res) => {
  const { slug, caption, isHero } = req.body;
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  const imageUrl = await uploadSingleMedia(req, req.file, `solution-gallery/${slug}`, "image");

  const image = await SolutionGallery.create({
    slug,
    imageUrl,
    caption: caption || "",
    isHero: isHero === "true"
  });

  res.status(201).json(image);
});

const update = asyncHandler(async (req, res) => {
  const image = await SolutionGallery.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  if (req.body.isHero !== undefined) {
    image.isHero = req.body.isHero === "true";
  }
  if (req.body.caption !== undefined) {
    image.caption = req.body.caption;
  }

  const updated = await image.save();
  res.json(updated);
});

const remove = asyncHandler(async (req, res) => {
  const image = await SolutionGallery.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }
  await image.deleteOne();
  res.json({ message: "Image deleted" });
});

module.exports = { getBySlug, upload, update, remove };
