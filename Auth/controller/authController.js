// controllers/authController.js

const RevokedToken = require('../RevokedTokenModel');

// Invalidate a token and store it in the revoked tokens collection
const invalidateToken = async (token) => {
  const revokedToken = new RevokedToken({ token });
  await revokedToken.save();
};

module.exports = {
  // ...other controller methods

  logout: async (req, res) => {
    const token = req.headers.authorization;

    try {
      await invalidateToken(token);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
