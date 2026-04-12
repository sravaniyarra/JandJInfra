const jwt = require("jsonwebtoken");

const generateToken = (adminId) =>
  jwt.sign({ id: adminId }, process.env.JWT_SECRET);

module.exports = generateToken;
