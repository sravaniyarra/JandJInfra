const express = require("express");
const { getAll, getUnreadCount, markRead, markAllRead } = require("../controllers/notificationController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protectAdmin, getAll);
router.get("/unread-count", protectAdmin, getUnreadCount);
router.put("/read-all", protectAdmin, markAllRead);
router.put("/:id/read", protectAdmin, markRead);

module.exports = router;
