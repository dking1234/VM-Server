const mongoose = require('mongoose');

const SmsSubscriptionSchema = new mongoose.Schema({
  userId: String,
  smsCost: Number,
  numberOfSMSs: Number,
  duration: String,       // Add duration field
  timestamp: Date,        // Add timestamp field
  expiration: Date,
  // Add other fields specific to the MB subscription
});

const SmsSubscription = mongoose.model('SmsSubscription', SmsSubscriptionSchema);

module.exports = SmsSubscription;
