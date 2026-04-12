const express = require("express");
const { getBySlug, upload, update, remove } = require("../controllers/solutionGalleryController");
const { protectAdmin } = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/:slug", getBySlug);
router.post("/", protectAdmin, uploadMiddleware.single("image"), upload);
router.put("/:id", protectAdmin, update);
router.delete("/:id", protectAdmin, remove);

module.exports = router;
