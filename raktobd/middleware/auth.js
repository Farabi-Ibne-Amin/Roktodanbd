const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure this is a user token, not an admin token (prevents privilege cross-use)
    if (decoded.type !== 'user') {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    // Ensure the account is still active
    if (user.status === 'suspended' || user.status === 'deleted') {
      return res.status(403).json({ error: 'Account is not active.' });
    }

    req.user = user;
    req.user.userId = user._id;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};