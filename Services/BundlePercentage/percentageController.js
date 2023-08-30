const MBSubscription = require('../BundleSpecification/mbBundle/mbModel');
const SecSubscription = require('../BundleSpecification/SecBundle/secModel'); // Replace with your model for seconds subscription
const SMSSubscription = require('../BundleSpecification/smsBundle/smsModel'); // Replace with your model for SMS subscription
const balanceController = require('../../Balance/balanceController');

const subscribePercentage = async (req, res) => {
  const { userId, amount, duration, mbPercentage, secPercentage, smsPercentage } = req.body;

  const userBalance = await balanceController.getBalanceByUserId(userId);
  const initialBalanceAmount = userBalance.amount;

  const prices = {
    day: { mb: 2, sec: 1, sms: 8 },
    week: { mb: 10, sec: 5, sms: 40 },
    month: { mb: 40, sec: 20, sms: 160 }
  };

  const calculateServiceAmount = (percentage, price) => (amount * percentage) / 100;

  const mbAmount = calculateServiceAmount(mbPercentage, prices[duration].mb);
  const secAmount = calculateServiceAmount(secPercentage, prices[duration].sec);
  const smsAmount = calculateServiceAmount(smsPercentage, prices[duration].sms);

  const numberOfMBs = Math.floor(mbAmount / prices[duration].mb);
  const numberOfSECs = Math.floor(secAmount / prices[duration].sec);
  const numberOfSMSs = Math.floor(smsAmount / prices[duration].sms);

  const totalCost = mbAmount + secAmount + smsAmount;

  if (initialBalanceAmount < totalCost) {
    return res.json({ success: false, message: 'Insufficient balance' });
  }

  try {
    const mbSubscription = new MBSubscription({ userId, mbAmount, numberOfMBs, duration, timestamp: new Date() });
    const secSubscription = new SecSubscription({ userId, secAmount, numberOfSECs, duration, timestamp: new Date() });
    const smsSubscription = new SMSSubscription({ userId, smsAmount, numberOfSMSs, duration, timestamp: new Date() });

    console.log('Initial userBalance:', initialBalanceAmount);
    console.log('Total cost:', totalCost);

    const newBalanceAmount = initialBalanceAmount - totalCost;
    console.log('Updated userBalance:', newBalanceAmount);

    if (!isNaN(newBalanceAmount)) {
      console.log('Before saving subscriptions:', mbSubscription, secSubscription, smsSubscription);
      await Promise.all([
        mbSubscription.save(),
        secSubscription.save(),
        smsSubscription.save(),
        balanceController.updateBalanceByUserId(userId, newBalanceAmount)
      ]);
      console.log('After saving subscriptions:', mbSubscription, secSubscription, smsSubscription);

      return res.json({ success: true, message: 'Subscription successfully' });
    } else {
      throw new Error('Invalid user balance calculation');
    }

  } catch (error) {
    console.error('Subscription failed:', error);
    return res.status(500).json({ success: false, message: 'Subscription failed' });
  }
};

module.exports = {
  subscribePercentage,
};
