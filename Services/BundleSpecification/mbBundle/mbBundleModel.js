// models/mbBundle.js
const mongoose = require('mongoose');

const mbBundleSchema = new mongoose.Schema({
  name: String,
  unitPricePerMB: Number,
});

module.exports = mongoose.model('mbBundle', mbBundleSchema);
