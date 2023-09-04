const mongoose = require('mongoose');

const secSubscriptionSchema = new mongoose.Schema({
  userId: String,
  secCost: Number,
  numberOfSECs: Number,
  duration: String,       // Add duration field
  timestamp: Date,        // Add timestamp field
  expiration: Date,
  // Add other fields specific to the MB subscription
});

const SecSubscription = mongoose.model('SecSubscription', secSubscriptionSchema);

module.exports = SecSubscription;
