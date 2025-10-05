const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Razorpay = require("razorpay");
require("dotenv").config();

const fileUploadController = require("./components/fileUploadController");

const app = express();
const PORT = process.env.PORT || 5001
// Middleware
app.use(cors());
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// === Routes ===

// Resume Upload and Processing
app.use("/api", fileUploadController);

// Resume Analysis Output Reader
app.get("/api/resume-data", (req, res) => {
  const filePath = path.join(__dirname, "output", "resume_analysis_output.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading JSON:", err);
    res.status(500).json({ error: "Failed to read resume data." });
  }
});

// Razorpay Subscription Route
app.post("/api/razorpay/create-subscription", async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });

    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    console.error("Error creating subscription:", err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
