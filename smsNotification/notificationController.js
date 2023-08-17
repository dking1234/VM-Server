const notificationModel = require('./notificationModel');
const otpController = require('../OTP/otpController');

const sendNotification = async (phoneNumber, req, res) => {

  const otp = otpController.generateOTP();
  await otpController.saveOTP(phoneNumber, otp);

  const data = {
    "ID": "",
    "user_id": 1973,
    "title": "TEST",
    "body": `Your OTP is: ${otp}`, // Use backticks and ${} for template interpolation
    "payload": "",
    "target_entity": "TEST_OTP",
    "notification_type": "sms",
    "destination": phoneNumber
  };

  try {
    const response = await notificationModel.sendNotification(data);
      
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = { sendNotification };
