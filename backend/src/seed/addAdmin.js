require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node src/seed/addAdmin.js <email> <password>");
  console.log("Example: node src/seed/addAdmin.js trb234@gmail.com MyPassword123");
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin with this email already exists");
    process.exit(0);
  }
  await Admin.create({ email, password });
  console.log(`Admin created: ${email}`);
  process.exit(0);
}

run().catch((e) => { console.error(e.message); process.exit(1); });
