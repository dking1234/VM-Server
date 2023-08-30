const express = require('express');
const mbController = require('./mbController');

const router = express.Router();

router.post('/', mbController.subscribeMB);


module.exports = router;
