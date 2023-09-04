const express = require('express');
const exchangeController = require('./exchangeController');

const router = express.Router();

// Define a POST route for subscription exchange
router.post('/exchange', async (req, res) => {
  const { userId, sourceSubscriptionType, targetSubscriptionType, amountToExchange, exchangeRate } = req.body;

  try {
    console.log('Starting subscription exchange...');
    
    const result = await exchangeController.exchangeSubscriptions(
      userId,
      sourceSubscriptionType,
      targetSubscriptionType,
      amountToExchange,
      exchangeRate
    );

    if (result.success) {
      console.log('Subscription exchange successful:', result);
      return res.json(result);
    } else {
      console.error('Subscription exchange failed:', result.message);
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Subscription exchange failed:', error);
    return res.status(500).json({ success: false, message: 'Subscription exchange failed' });
  }
});

module.exports = router;
