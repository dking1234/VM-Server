const express = require('express');
const smsController = require('./smsController');

const router = express.Router();

router.post('/', smsController.subscribeSMS);


module.exports = router;
