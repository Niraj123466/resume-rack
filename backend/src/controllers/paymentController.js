const Razorpay = require('razorpay');
const config = require('../config');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Create subscription
const createSubscription = async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: config.razorpay.planId,
      customer_notify: 1,
      total_count: 12,
    });

    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    console.error("Error creating subscription:", err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

module.exports = {
  createSubscription
};