// routes/mbBundleRoutes.js
const express = require('express');
const mbBundleController = require('./mbBundleController');

const router = express.Router();

// Use mbBundleController routes
router.use('/', mbBundleController);

module.exports = router;
