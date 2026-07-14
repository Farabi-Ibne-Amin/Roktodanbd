const express = require('express');
const router = express.Router();
const { User, BloodRequest, Thalassemia } = require('../models');
const { upload } = require('../utils/cloudinary');
const { notifyDonors, sendRegistrationConfirmation } = require('../utils/email');
const fs = require('fs');
const path = require('path');

// GET /api/donors — List approved donors (filter: bloodGroup, district, upazila)
router.get('/donors', async (req, res) => {
  try {
    const { bloodGroup, district, upazila, limit, sort } = req.query;
    let query = { role: 'donor', status: 'approved' };
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;

    // Exclude donors who donated in the last 120 days
    const now = new Date();
    query.$or = [
      { lastDonated: { $exists: false } },
      { lastDonated: { $lt: new Date(now - 120 * 24 * 60 * 60 * 1000) } },
      { reactivateAt: { $lte: now } }
    ];

    let sortOption = { lastDonated: 1 }; // oldest donation first
    if (sort === 'donationCount') sortOption = { donationCount: -1 };

    const donors = await User.find(query)
      .select('name bloodGroup district upazila lastDonated donationCount')
      .sort(sortOption)
      .limit(parseInt(limit) || 0); // 0 means no limit

    res.json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/donors/stats — { totalDonors, totalLives, totalDistricts, totalHospitals }
router.get('/donors/stats', async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor', status: 'approved' });
    // totalLives: sum of donationCount of all approved donors
    const donationSum = await User.aggregate([
      { $match: { role: 'donor', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$donationCount' } } }
    ]);
    const totalLives = donationSum.length > 0 ? donationSum[0].total : 0;
    // totalDistricts: count of distinct districts where approved donors exist
    const totalDistricts = await User.distinct('district', { role: 'donor',role: 'donor', status: 'approved' });
    // totalHospitals: we don't have a hospital collection, so we'll set to 0 for now
    // In a real app, we might have a hospitals collection or derive from other data
    const totalHospitals = 0;

    res.json({ totalDonors, totalLives, totalDistricts: totalDistricts.length, totalHospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/districts — All districts with upazila lists
router.get('/districts', async (req, res) => {
  try {
    // We'll get distinct districts and their upazilas from the User model
    // This is not ideal for a production app, but for the backend we can provide this.
    // In a real app, you would have a separate districts collection or a static file.
    const districts = await User.aggregate([
      { $match: { role: 'donor', status: 'approved' } },
      { $group: { _id: '$district', upazilas: { $addToSet: '$upazila' } } },
      { $project: { _id: 0, district: '$_id', upazilas: { $filter: { input: '$upazilas', cond: { $ne: [ '$$this', null ] } } } } }
    ]);
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests — List open blood requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'open' })
      .select('requesterName phone bloodGroup hospital district upazila urgency bagsNeeded note createdAt')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/requests — Submit new blood request (public, no auth)
router.post('/requests', async (req, res) => {
  try {
    const {
      requesterName,
      phone,
      bloodGroup,
      hospital,
      district,
      upazila,
      urgency,
      bagsNeeded,
      note
    } = req.body;

    const request = new BloodRequest({
      requesterName,
      phone,
      bloodGroup,
      hospital,
      district,
      upazila,
      urgency,
      bagsNeeded,
      note
    });

    await request.save();

    // ── FIND AND NOTIFY MATCHING DONORS ──────────────────────────
    // Find approved donors in the same district with matching blood group and email addresses
    try {
      const matchingDonors = await User.find({
        status: 'approved',
        role: 'donor',
        district: district,
        bloodGroup: bloodGroup,
        email: { $exists: true, $ne: '' }
      }).select('name email phone bloodGroup district');

      if (matchingDonors.length > 0) {
        console.log(`🔔 Found ${matchingDonors.length} matching donors in ${district} for blood ${bloodGroup}`);
        notifyDonors(
          { requesterName, phone, bloodGroup, hospital, district, urgency: urgency || 'normal' },
          matchingDonors
        ).catch(err => console.error('❌ Email notification error:', err));
      } else {
        console.log(`ℹ️ No matching donors found in ${district} with email for blood ${bloodGroup}`);
      }
    } catch (notifyErr) {
      console.error('❌ Failed to look up matching donors for notification:', notifyErr);
    }

    res.status(201).json({ message: 'Blood request submitted successfully', requestId: request._id });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/thalassemia — Submit thalassemia assistance application
router.post('/thalassemia', async (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      district,
      bloodGroup,
      transfusionFreq,
      hospital,
      doctorName,
      note
    } = req.body;

    const application = new Thalassemia({
      name,
      phone,
      age,
      district,
      bloodGroup,
      transfusionFreq,
      hospital,
      doctorName,
      note
    });

    await application.save();
    res.status(201).json({ message: 'Thalassemia application submitted successfully', applicationId: application._id });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/register — Register new user (multipart/form-data with files)
router.post('/register', upload.fields([
  { name: 'bloodReport', maxCount: 1 },
  { name: 'hbReport', maxCount: 1 },
  { name: 'nidReport', maxCount: 1 },
  { name: 'cbcReport', maxCount: 1 },
  { name: 'infReport', maxCount: 1 },
  { name: 'certReport', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if phone already exists
    const existingUser = await User.findOne({ phone: req.body.phone });
    if (existingUser) {
      // Clean up uploaded files if any
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (file.path) {
            // In Cloudinary, we don't have a local path to unlink, but we can delete from Cloudinary if needed.
            // For now, we'll just ignore because the upload middleware already uploaded to Cloudinary.
            // We'll leave the file in Cloudinary as orphaned, but in a real app we might want to clean up.
          }
        });
      }
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Prepare files object
    const files = {};
    const fileTypes = ['bloodReport', 'hbReport', 'nidReport', 'cbcReport', 'infReport', 'certReport'];
    fileTypes.forEach(type => {
      if (req.files && req.files[type] && req.files[type][0]) {
        const file = req.files[type][0];
        files[type] = {
          url: file.path, // This is the Cloudinary URL from the upload middleware
          publicId: file.filename // This is the public_id from Cloudinary
        };
      } else {
        files[type] = { url: '', publicId: '' };
      }
    });

    // Create user
    const user = new User({
      ...req.body,
      password: hashedPassword,
      files,
      status: 'pending' // default
    });

    await user.save();

    // Send registration confirmation email asynchronously
    if (user.email) {
      sendRegistrationConfirmation(user).catch(err => console.error('❌ Registration email error:', err));
    }

    res.status(201).json({ message: 'Registration successful', userId: user._id });
  } catch (error) {
    console.error('❌ Registration route error:', error.stack || error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;