const express = require("express");
const { getAll, getById, create, update, remove, exportBudget } = require("../controllers/budgetController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protectAdmin, getAll);
router.get("/:id", protectAdmin, getById);
router.post("/", protectAdmin, create);
router.put("/:id", protectAdmin, update);
router.delete("/:id", protectAdmin, remove);
router.post("/export-budget", protectAdmin, exportBudget);
router.get("/:id/export", protectAdmin, exportBudget);

module.exports = router;
