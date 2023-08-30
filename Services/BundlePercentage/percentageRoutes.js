const express = require('express');
const percentageController = require('./percentageController');

const router = express.Router();

router.post('/', percentageController.subscribePercentage);


module.exports = router;
