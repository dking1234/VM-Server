const SecSubscription = require('./secModel');
const balanceController = require('../../../Balance/balanceController');

const subscribeSEC = async (req, res) => {
  const { userId, amount, duration } = req.body;

  // Fetches the user balance
  const userBalance = await balanceController.getBalanceByUserId(userId);

  // Extract the amount from the balance object
  const initialBalanceAmount = userBalance.amount;

  const prices = {
    day: { sec: 1 },
    week: { sec: 1.2 },
    month: { sec: 2.1 }
  };

  const pricePerSEC = prices[duration].sec;

  const numberOfSECs = Math.floor(amount / pricePerSEC);

  const totalCost = amount;

  if (initialBalanceAmount < totalCost) {
    return res.json({ success: false, message: 'Insufficient balance' });
  }

  try {
     // Calculate the expiration date based on the duration
     const expiration = new Date();
     if (duration === 'day') {
       expiration.setDate(expiration.getDate() + 1);
     } else if (duration === 'week') {
       expiration.setDate(expiration.getDate() + 7);
     } else if (duration === 'month') {
       expiration.setMonth(expiration.getMonth() + 1);
     }
    
    // Perform the subscription
    const newSubscription = new SecSubscription({
      userId,
      secAmount: amount,
      numberOfSECs: numberOfSECs,
      duration: duration,     // Set the duration
      timestamp: new Date(),// Set the timestamp
      expiration: expiration,
      // ...other fields
    });

    if (isNaN(amount) || isNaN(totalCost)) {
      throw new Error('Invalid amount or totalCost');
    }
    console.log('Initial userBalance:', initialBalanceAmount);
    console.log('Total cost:', totalCost);
    const newBalanceAmount = initialBalanceAmount - totalCost;
    console.log('Updated userBalance:', newBalanceAmount);

    // Make sure newBalanceAmount is a valid number before updating
    if (!isNaN(newBalanceAmount)) {
      console.log('Before saving subscription:', newSubscription);
      await Promise.all([
        newSubscription.save(),
        balanceController.updateBalanceByUserId(userId, newBalanceAmount)
      ]);
      console.log('After saving subscription:', newSubscription);

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
  subscribeSEC,
};
