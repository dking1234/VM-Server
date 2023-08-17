const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserRoutes = require('./User/UserRoutes')
const BalanceRoutes = require('./Balance/balanceRoutes');
const protectedRoute = require('./Auth/routes/protectedRoute');
const authController = require('./Auth/controller/authController');
const notificationRoutes = require('./smsNotification/notificationRoutes');
const otpRoutes = require('./OTP/otpRoutes');
const mbBundleRoutes = require('./Services/BundleSpecification/mbBundle/mbBundleRoutes');


// Create the server
const app = express();

// Middleware

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Mkushi:mkushi@cluster0.1tsknqp.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Usage routes

app.use('/signup', UserRoutes);
app.use('/user', UserRoutes);
app.use('/balance', BalanceRoutes);

// Use the protected route with the checkRevokedToken middleware
app.use('/protected', protectedRoute);

// Use the logout route to invalidate tokens
app.post('/logout', authController.logout);

// use the notification 
app.use('/notification', notificationRoutes);

// Mount the OTP routes
app.use('/verify', otpRoutes);

// Use mbBundleRoutes
app.use('/', mbBundleRoutes);


