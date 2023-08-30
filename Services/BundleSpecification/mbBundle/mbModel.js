const mongoose = require('mongoose');

const mbSubscriptionSchema = new mongoose.Schema({
  userId: String,
  mbAmount: Number,
  numberOfMBs: Number,
  duration: String,       // Add duration field
  timestamp: Date,        // Add timestamp field
  expiration: Date,
  // Add other fields specific to the MB subscription
});

const MBSubscription = mongoose.model('MBSubscription', mbSubscriptionSchema);

module.exports = MBSubscription;
