const MBSubscription = require('../BundleSpecification/mbBundle/mbModel');
const SecSubscription = require('../BundleSpecification/SecBundle/secModel');
const SMSSubscription = require('../BundleSpecification/smsBundle/smsModel');
const BundleExchange = require('./exchangeModel');

// Define the subscription model map
const subscriptionModelMap = {
  mb: MBSubscription,
  sec: SecSubscription,
  sms: SMSSubscription,
};

const fetchAndUpdateSubscription = async (userId, subscriptionType, amountToExchange, exchangeRate) => {
  if (!subscriptionModelMap[subscriptionType]) {
    throw new Error(`Invalid subscription type: ${subscriptionType}`);
  }

  const sourceSubscriptionModel = subscriptionModelMap[subscriptionType];
  const sourceField = `numberOf${subscriptionType.toUpperCase()}s`;

  // Fetch the source subscription
  const sourceSubscription = await sourceSubscriptionModel.findOne({
    userId,
    duration: { $gt: new Date() },
  });

  if (!sourceSubscription || sourceSubscription[sourceField] < amountToExchange) {
    throw new Error(`No valid ${subscriptionType} subscription available for exchange`);
  }

  // Calculate the deduction amount (20%)
  const deductionPercentage = 20;
  const deductionAmount = (amountToExchange * deductionPercentage) / 100;

  // Calculate the amount that goes to the target subscription
  const receivedAmount = amountToExchange - deductionAmount;

  // Deduct the amount from the source subscription
  sourceSubscription[sourceField] -= amountToExchange;
  await sourceSubscription.save();

  return { sourceSubscription, receivedAmount };
};

const exchangeSubscriptions = async (userId, sourceSubscriptionType, targetSubscriptionType, amountToExchange, exchangeRate) => {
  try {
    console.log('Starting subscription exchange...');

    // Fetch and update the source subscription, including deduction
    const { sourceSubscription, receivedAmount } = await fetchAndUpdateSubscription(
      userId,
      sourceSubscriptionType,
      amountToExchange,
      exchangeRate
    );

    // Fetch and update the target subscription
    const targetSubscriptionField = `numberOf${targetSubscriptionType.toUpperCase()}s`;
    const TargetSubscriptionModel = subscriptionModelMap[targetSubscriptionType];

    const targetSubscription = await TargetSubscriptionModel.findOne({
      userId,
      duration: { $gt: new Date() },
    });

    if (!targetSubscription) {
      throw new Error(`No valid ${targetSubscriptionType} subscription available for exchange`);
    }

    // Add the received amount to the target subscription
    targetSubscription[targetSubscriptionField] += receivedAmount;
    await targetSubscription.save();

    console.log('Subscription exchange successful');

    // Create the exchange record
    const exchangeRecord = new BundleExchange({
      userId,
      exchangedAmount: amountToExchange,
      receivedAmount,
      sourceSubscriptionType,
      targetSubscriptionType,
      timestamp: new Date(),
    });

    await exchangeRecord.save();
    console.log('Exchange record created:', exchangeRecord);

    return { success: true, message: 'Subscription exchange successful' };
  } catch (error) {
    console.error('Subscription exchange failed:', error);
    return { success: false, message: 'Subscription exchange failed' };
  }
};

module.exports = {
  exchangeSubscriptions,
};
