const express = require("express");
const { loginAdmin, verifyOtp, resendOtp, getMe } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", protectAdmin, getMe);

module.exports = router;
