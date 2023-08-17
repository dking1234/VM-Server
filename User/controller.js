const bcrypt = require('bcryptjs');  // Use bcryptjs here
const User = require('./UserModel');
const Balance = require('../Balance/BalanceModel');
const otpController = require('../OTP/otpController');
const notificationController = require('../smsNotification/notificationController')
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, phoneNumber, password, confirmPassword } = req.body;
    console.log('Request Body:', req.body);
    
    if (!name || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    
    if (phoneNumber.length !== 10) {
      return res.status(400).json({ error: "Phone number should be 10 digits" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      phoneNumber,
      password: hashedPassword,
    });
    
    const savedUser = await newUser.save();
    
    // Create Balance for the user
    const balance = new Balance({
      user: savedUser._id,
      amount: 0,
      currency: 'Tsh',
    });

    await balance.save();

    // Send OTP to the provided phoneNumber
    
    const sendNotificationresponse = notificationController.sendNotification(phoneNumber, req, res);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
  }
};


  

const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    console.log("Login attempt:", phoneNumber);

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      console.log("User not found:", phoneNumber);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password does not match:", phoneNumber);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("Login successful:", phoneNumber);

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id }, // Payload data to include in the token
      '111111', // Secret key used to sign the token
      { expiresIn: '1h' } // Token expiration time
    );

    // Successful login
    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

  const getUserByName = async (req, res) => {
    try {
        const { userId } = req.params; // Get phone number from URL params
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Successful retrieval
        res.status(200).json({ name: user.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
const getUserIDByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  signup,
  login,
  getUserByName,
  getUserIDByPhoneNumber
};
