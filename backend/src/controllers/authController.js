const crypto = require("crypto");
const nodemailer = require("nodemailer");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

const sendOtpEmail = async (email, otp) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[Auth] SMTP not configured, OTP:", otp);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "J&J Infra - Login OTP",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f8f6f1;padding:20px">
        <div style="max-width:420px;margin:auto;background:#fff;border:1px solid #e5dccf;border-radius:14px;padding:24px;text-align:center">
          <h2 style="margin:0 0 8px;color:#1f2937">Login Verification</h2>
          <p style="margin:0 0 20px;color:#6b7280;font-size:14px">Use this OTP to complete your sign in</p>
          <div style="background:#f0fdfa;border:2px solid #0f766e;border-radius:12px;padding:16px;margin:0 auto 16px;max-width:200px">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0f766e">${otp}</span>
          </div>
          <p style="color:#9ca3af;font-size:12px">This code expires in 5 minutes. Do not share it.</p>
          <p style="margin-top:16px;color:#d1d5db;font-size:11px">J & J Infra • Secure Login</p>
        </div>
      </div>
    `,
    text: `Your J&J Infra login OTP is: ${otp}. It expires in 5 minutes.`
  });
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email || "").toLowerCase() });

  if (!admin || !(await admin.matchPassword(password || ""))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  admin.otp = otp;
  admin.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await admin.save();

  // Send OTP via email
  await sendOtpEmail(admin.email, otp);

  res.json({
    message: "OTP sent to your email",
    adminId: admin._id,
    email: admin.email
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { adminId, otp } = req.body;
  if (!adminId || !otp) {
    res.status(400);
    throw new Error("adminId and otp are required");
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  if (!admin.otp || admin.otp !== String(otp)) {
    res.status(401);
    throw new Error("Invalid OTP");
  }

  if (admin.otpExpiresAt && admin.otpExpiresAt < new Date()) {
    admin.otp = null;
    admin.otpExpiresAt = null;
    await admin.save();
    res.status(401);
    throw new Error("OTP has expired. Please login again.");
  }

  // Clear OTP after successful verification
  admin.otp = null;
  admin.otpExpiresAt = null;
  await admin.save();

  res.json({
    token: generateToken(admin._id),
    admin: { id: admin._id, email: admin.email }
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { adminId } = req.body;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  admin.otp = otp;
  admin.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await admin.save();

  await sendOtpEmail(admin.email, otp);

  res.json({ message: "OTP resent to your email" });
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

module.exports = { loginAdmin, verifyOtp, resendOtp, getMe };
