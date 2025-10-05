require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    planId: process.env.RAZORPAY_PLAN_ID
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  paths: {
    uploads: process.env.UPLOAD_PATH || 'uploads',
    jobdesc: process.env.JOBDESC_PATH || 'jobdesc',
    output: process.env.OUTPUT_PATH || 'output'
  }
};