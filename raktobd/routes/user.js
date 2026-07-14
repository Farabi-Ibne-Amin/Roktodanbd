const express = require('express');
const router = express.Router();
const { User, DonationLog } = require('../models');
const auth = require('../middleware/auth');

// POST /api/user/login — { email/phone, password } → { token, name, phone }
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = email ? await User.findOne({ email }) : await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Account not approved' });
    }

    const token = user.generateAuthToken();
    res.json({ token, name: user.name, phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// We need to add a method to generate auth token to the User model.
// We'll do that in the model file. For now, we'll use jwt.sign.

// GET /api/user/profile — Get own profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/user/profile — Update own profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'dob', 'bloodGroup', 'weight', 'district', 'upazila', 'healthNote'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/donations — Get own donation history
router.get('/donations', auth, async (req, res) => {
  try {
    const donations = await DonationLog.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/donation — Log a donation { date, type, hospital }
router.post('/donation', auth, async (req, res) => {
  try {
    const { date, type, hospital } = req.body;
    if (!date || !type || !hospital) {
      return res.status(400).json({ error: 'Date, type, and hospital are required' });
    }

    const donationLog = new DonationLog({
      userId: req.user.userId,
      date,
      type,
      hospital
    });

    await donationLog.save();

    // Update user's donationCount and lastDonated
    const user = await User.findById(req.user.userId);
    user.donationCount += 1;
    user.lastDonated = new Date(date);
    user.reactivateAt = new Date(date);
    user.reactivateAt.setDate(user.reactivateAt.getDate() + 120);
    await user.save();

    res.status(201).json({ message: 'Donation logged successfully', donationLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/donated-today — Mark donated today → sets lastDonated=now, reactivateAt=+120days, removes from active list
router.post('/donated-today', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    user.lastDonated = now;
    user.donationCount += 1;
    user.reactivateAt = new Date(now);
    user.reactivateAt.setDate(user.reactivateAt.getDate() + 120);

    // Create a donation log entry for today's donation
    const donationLog = new DonationLog({
      userId: user._id,
      date: now,
      type: 'full', // assuming whole blood
      hospital: 'Unknown', // or we can ask for hospital? The spec says it sets lastDonated and reactivateAt, but doesn't mention hospital.
      // We'll leave hospital as empty or set to a default.
      status: 'verified'
    });

    await donationLog.save();
    await user.save();

    res.json({ message: 'Donation recorded for today', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// We need to add the generateAuthToken method to the User model.
// We'll do that in the model file.

module.exports = router;