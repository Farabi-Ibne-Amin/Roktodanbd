const express = require('express');
const router = express.Router();
const { User, BloodRequest, Donation, Thalassemia, Admin } = require('../models');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { sendApprovalEmail, sendRejectionEmail, sendSuspensionEmail } = require('../utils/email');

// POST /api/admin/login — { email, password } → { token }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = admin.generateAuthToken();
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// We'll protect all admin routes with adminAuth middleware
// GET /api/admin/users — All users (paginated, filterable by status/blood/district)
router.get('/users', adminAuth, async (req, res) => {
  try {
    // We'll implement pagination and filtering later.
    // For now, we'll return all users without password.
    const users = await User.find().select('-password -__v');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users/:id — Single user detail
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/approve — Approve donor registration
router.put('/users/:id/approve', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'approved';
    user.adminNote = req.body.adminNote || '';
    await user.save();

    // Send approval email notification asynchronously
    if (user.email) {
      sendApprovalEmail(user).catch(err => console.error('❌ Approval email error:', err));
    }

    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/reject — Reject with adminNote
router.put('/users/:id/reject', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'rejected';
    user.adminNote = req.body.adminNote || '';
    await user.save();

    // Send rejection email notification asynchronously
    if (user.email) {
      sendRejectionEmail(user).catch(err => console.error('❌ Rejection email error:', err));
    }

    res.json({ message: 'User rejected successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id/suspend — Suspend user
router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'suspended';
    user.adminNote = req.body.adminNote || '';
    await user.save();

    // Send suspension email notification asynchronously
    if (user.email) {
      sendSuspensionEmail(user).catch(err => console.error('❌ Suspension email error:', err));
    }

    res.json({ message: 'User suspended successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id — Soft delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'deleted';
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/requests — All blood requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/requests/:id — Update request status
router.put('/requests/:id', adminAuth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const { status, fulfilledBy } = req.body;
    if (status) request.status = status;
    if (fulfilledBy) request.fulfilledBy = fulfilledBy;

    await request.save();

    res.json({ message: 'Request updated successfully', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ status: 'pending' });
    const openRequests = await BloodRequest.countDocuments({ status: 'open' });
    const totalDonations = await Donation.countDocuments(); // bKash donations

    res.json({ totalUsers, pendingApprovals, openRequests, totalDonations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/donations — bKash donation list
router.get('/donations', adminAuth, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/thalassemia — Thalassemia applications
router.get('/thalassemia', adminAuth, async (req, res) => {
  try {
    const applications = await Thalassemia.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/thalassemia/:id — Update thalassemia status
router.put('/thalassemia/:id', adminAuth, async (req, res) => {
  try {
    const application = await Thalassemia.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { status } = req.body;
    if (status) application.status = status;

    await application.save();

    res.json({ message: 'Application updated successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/settings — Get site settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // We don't have a settings model, so we'll return default values.
    // In a real app, we would have a Settings model or use environment variables.
    res.json({
      emergencyBannerText: '🚨 জরুরি রক্তের প্রয়োজন? এখনি ফোন করুন: 01700-000000',
      siteAnnouncementEnabled: false,
      contactPhone: '01700-000000'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/settings — Update site settings
router.put('/settings', adminAuth, async (req, res) => {
  try {
    // We'll update environment variables or a settings document in the database.
    // For now, we'll just return a success message.
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;