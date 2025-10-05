const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const resumeController = require('../controllers/resumeController');
const paymentController = require('../controllers/paymentController');
const upload = require('../middlewares/upload');

// File upload routes
router.post('/upload', upload.array('files'), fileController.uploadFiles);
router.post('/run-script', fileController.runScript);

// Resume data route
router.get('/resume-data', resumeController.getResumeData);

// Payment routes
router.post('/razorpay/create-subscription', paymentController.createSubscription);

module.exports = router;