const Balance = require('./BalanceModel');

const createBalance = async (req, res) => {
  try {
    const { userId, amount, currency } = req.body;

    console.log('Creating balance with userId:', userId);

    // Check if a balance already exists for the user
    const existingBalance = await Balance.findOne({ user: userId });

    console.log('Existing balance:', existingBalance);

    if (existingBalance) {
      return res.status(409).json({ error: 'Balance already exists for this user' });
    }

    // Create a new balance with zero value
    const balance = new Balance({
      user: userId,
      amount: 0, // Initialize with zero
      currency,
    });

    const savedBalance = await balance.save();

    console.log('Saved balance:', savedBalance);

    res.status(201).json(savedBalance);
  } catch (error) {
    console.error('Error creating balance:', error);
    res.status(500).json({ error: error.message });
  }
};


// Get balance by user ID
const getBalanceByUserId = async (userId) => {
  try {
    const balance = await Balance.findOne({ user: userId });

    if (!balance) {
      console.log('Balance not found for userId:', userId);
      throw new Error('Balance not found');
    }

    console.log('Balance found:', balance);

    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Error fetching balance');
  }
};


// Update balance by user ID
const updateBalanceByUserId = async (userId, newBalance) => {
  try {
    // Find and update the balance document
    const balance = await Balance.findOneAndUpdate(
      { user: userId },
      { $set: { amount: newBalance } },
      { new: true }
    );

    console.log('Balance updated:', balance);

    return balance;
  } catch (error) {
    console.error('Error updating balance:', error);
    throw new Error('Error updating balance');
  }
};

const depositAmount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, currency } = req.body;

    // Find the user's balance in the database
    const balance = await Balance.findOne({ user: userId });

    if (!balance) {
      return res.status(404).json({ error: 'Balance not found' });
    }

    // Update the balance amount
    balance.amount += amount;
    const updatedBalance = await balance.save();

    res.status(200).json(updatedBalance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createBalance,
  getBalanceByUserId,
  updateBalanceByUserId,
  depositAmount,
};
