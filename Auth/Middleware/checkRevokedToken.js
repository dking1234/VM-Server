// middleware/checkRevokedToken.js

const RevokedToken = require('../RevokedTokenModel');

const checkRevokedToken = async (req, res, next) => {
  const token = req.headers.authorization;

  // Check if the token is revoked
  const isRevoked = await RevokedToken.exists({ token });

  if (isRevoked) {
    return res.status(401).json({ message: 'Token is revoked' });
  }

  next();
};

module.exports = checkRevokedToken;
