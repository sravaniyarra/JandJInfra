require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await mongoose.connection.db
    .collection("admins")
    .updateOne(
      { email: "admin@example.com" },
      { $set: { email: "sravaniyarra55@gmail.com" } }
    );
  console.log("Updated", result.modifiedCount, "admin(s)");
  process.exit(0);
}

run().catch((e) => { console.error(e.message); process.exit(1); });
