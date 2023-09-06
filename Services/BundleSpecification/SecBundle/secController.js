const SecSubscription = require('./secModel');
const balanceController = require('../../../Balance/balanceController');

const subscribeSEC = async (req, res, next) => {
try {
const { userId, amount, duration } = req.body;

// Validate input data
if (!userId || isNaN(amount) || !['day', 'week', 'month'].includes(duration)) {
console.log(`Invalid request data: ${req.body}`);
res.status(400).json({ success: false, message: 'Invalid request data' });
}

console.log(`Valid request data: ${req.body}`);

// Fetch the user balance
console.log(`Fetching user balance for userId: ${userId}`);
balanceController.getBalanceByUserId({params: {userId}}, (userBalance) => {
console.log(`User balance: ${userBalance}`);

const initialBalanceAmount = userBalance.amount;

const prices = {
day: { sec: 1 },
week: { sec: 1.2 },
month: { sec: 2.1 },
};

const pricePerSEC = prices[duration]?.sec;

if (!pricePerSEC) {
console.log(`Invalid duration: ${duration}`);
res.status(400).json({ success: false, message: 'Invalid duration' });
}

console.log(`Price per SEC: ${pricePerSEC}`);

const numberOfSECs = Math.floor(amount / pricePerSEC);
const totalCost = amount;

if (initialBalanceAmount < totalCost) {
console.log(`Insufficient balance. Initial balance: ${initialBalanceAmount}, Total cost: ${totalCost}`);
res.json({ success: false, message: 'Insufficient balance' });
}

// Calculate the expiration date based on the duration
const expiration = new Date();
switch (duration) {
case 'day':
expiration.setDate(expiration.getDate() + 1);
break;
case 'week':
expiration.setDate(expiration.getDate() + 7);
break;
case 'month':
expiration.setMonth(expiration.getMonth() + 1);
break;
}

// Create the subscription
const newSubscription = new SecSubscription({
userId,
secCost: amount,
numberOfSECs,
duration,
timestamp: new Date(),
expiration,
// ...other fields
});

console.log(`Initial userBalance: ${initialBalanceAmount}`);
console.log(`Total cost: ${totalCost}`);
const newBalanceAmount = initialBalanceAmount - totalCost;
console.log(`Updated userBalance: ${newBalanceAmount}`);

// Ensure newBalanceAmount is valid before updating
if (!isNaN(newBalanceAmount)) {
console.log(`Before saving subscription: ${newSubscription}`);
Promise.all([
newSubscription.save(),
balanceController.updateBalanceByUserId(userId, newBalanceAmount),
]).then(() => {
console.log(`After saving subscription: ${newSubscription}`);
res.json({ success: true, message: 'Subscription successful' });
}).catch((error) => {
throw error;
});

} else {
throw new Error('Invalid user balance calculation');
}
});

} catch (error) {
console.error('Subscription failed:', error);
res.status(500).json({ success: false, message: 'Subscription failed' });
} finally {
// Close any connections or resources here
}
};

module.exports = {
subscribeSEC,
};