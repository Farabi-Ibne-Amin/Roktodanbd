const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate as admin.' });
  }
};