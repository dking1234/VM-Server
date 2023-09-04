const mongoose = require('mongoose');

const bundleExchangeSchema = new mongoose.Schema({
  userId: String,
  exchangedAmount: Number,
  receivedAmount: Number,
  sourceSubscriptionType: String,
  targetSubscriptionType: String, // Remove this line
  timestamp: Date,
});

const BundleExchange = mongoose.model('BundleExchange', bundleExchangeSchema);

module.exports = BundleExchange;
