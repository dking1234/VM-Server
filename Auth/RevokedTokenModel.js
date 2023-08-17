// models/RevokedToken.js

const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now },
});

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);

module.exports = RevokedToken;
