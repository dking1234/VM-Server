const express = require('express');
const { signup, login, getUserByName, getUserIDByPhoneNumber } = require('./controller');

const router = express.Router();

// Create a new user
router.post('/', signup);

// User login
router.post('/login', login);

// User name from id
router.get('/name/:userId', getUserByName);

// User id from phone number
router.get('/id/:phoneNumber', getUserIDByPhoneNumber);

module.exports = router;
