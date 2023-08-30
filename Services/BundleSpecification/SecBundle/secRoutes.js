const express = require('express');
const secController = require('./secController');

const router = express.Router();

router.post('/', secController.subscribeSEC);


module.exports = router;
