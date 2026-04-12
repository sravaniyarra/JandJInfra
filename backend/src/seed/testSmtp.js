require("dotenv").config();
const nodemailer = require("nodemailer");

async function testSmtp() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_NOTIFY_EMAIL } = process.env;

  console.log("SMTP Config:");
  console.log("  Host:", SMTP_HOST);
  console.log("  Port:", SMTP_PORT);
  console.log("  User:", SMTP_USER);
  console.log("  Pass:", SMTP_PASS ? `${SMTP_PASS.slice(0, 4)}****` : "NOT SET");
  console.log("  Notify Email:", LEAD_NOTIFY_EMAIL);
  console.log("");

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  console.log("Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("SMTP connection successful!");
  } catch (err) {
    console.error("SMTP connection FAILED:", err.message);
    process.exit(1);
  }

  console.log("Sending test email...");
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: "sravaniyarra55@gmail.com",
      subject: "J&J Infra - SMTP Test",
      text: "If you received this, your SMTP configuration is working correctly."
    });
    console.log("Test email sent! Message ID:", info.messageId);
  } catch (err) {
    console.error("Send FAILED:", err.message);
  }
}

testSmtp();
