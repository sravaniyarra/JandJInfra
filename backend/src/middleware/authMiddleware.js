const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/Admin");

const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      res.status(401);
      throw new Error("Not authorized, admin not found");
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === "TokenExpiredError") {
      throw new Error("Not authorized, token expired");
    }
    throw new Error("Not authorized, token invalid");
  }
});

module.exports = { protectAdmin };
