const asyncHandler = require("../utils/asyncHandler");
const Notification = require("../models/Notification");

const getAll = asyncHandler(async (_req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

const getUnreadCount = asyncHandler(async (_req, res) => {
  const count = await Notification.countDocuments({ read: false });
  res.json({ count });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  notification.read = true;
  await notification.save();
  res.json(notification);
});

const markAllRead = asyncHandler(async (_req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  res.json({ message: "All notifications marked as read" });
});

module.exports = { getAll, getUnreadCount, markRead, markAllRead };
