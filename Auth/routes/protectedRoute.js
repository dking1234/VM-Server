// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const checkRevokedToken = require('../Middleware/checkRevokedToken');

// Apply the checkRevokedToken middleware before processing the route
router.get('/protected', checkRevokedToken, (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

module.exports = router;
