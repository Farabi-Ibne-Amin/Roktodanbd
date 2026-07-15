const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please authenticate as admin.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Please authenticate as admin.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure this is an admin token, not a user token (prevents privilege cross-use)
    if (decoded.type !== 'admin') {
      return res.status(401).json({ error: 'Please authenticate as admin.' });
    }

    const admin = await Admin.findById(decoded._id);
    if (!admin) {
      return res.status(401).json({ error: 'Please authenticate as admin.' });
    }

    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate as admin.' });
  }
};