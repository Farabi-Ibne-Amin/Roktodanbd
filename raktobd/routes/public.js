const express = require('express');
const router = express.Router();
const { User, BloodRequest, Thalassemia } = require('../models');
const { upload } = require('../utils/cloudinary');
const { notifyDonors, sendRegistrationConfirmation } = require('../utils/email');

// ── Input validation helpers ──────────────────────────────────────────────────

/** Validates a Bangladeshi phone number (11 digits starting with 01) */
const isValidPhone = (phone) => /^01[3-9]\d{8}$/.test(phone);

/** Validates blood group values */
const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const isValidBloodGroup = (bg) => VALID_BLOOD_GROUPS.includes(bg);

/** Clamps a string to a maximum length */
const maxLen = (str, len) => typeof str === 'string' ? str.slice(0, len) : str;

// GET /api/donors — List approved donors (filter: bloodGroup, district, upazila)
router.get('/donors', async (req, res) => {
  try {
    const { bloodGroup, district, upazila, sort } = req.query;

    // Cap limit to prevent fetching millions of records
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);

    let query = { role: 'donor', status: 'approved' };
    if (bloodGroup && isValidBloodGroup(bloodGroup)) query.bloodGroup = bloodGroup;
    if (district) query.district = maxLen(district, 100);
    if (upazila) query.upazila = maxLen(upazila, 100);

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
      .limit(limit);

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
    const totalDistricts = await User.distinct('district', { role: 'donor', status: 'approved' });
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

    // ── Input validation ────────────────────────────────────────────────────
    if (!requesterName || typeof requesterName !== 'string' || requesterName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid requester name is required.' });
    }
    if (!phone || !isValidPhone(phone.trim())) {
      return res.status(400).json({ error: 'A valid Bangladeshi phone number is required.' });
    }
    if (!bloodGroup || !isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({ error: 'A valid blood group is required.' });
    }
    if (!hospital || typeof hospital !== 'string' || hospital.trim().length < 2) {
      return res.status(400).json({ error: 'Hospital name is required.' });
    }
    if (!district || typeof district !== 'string' || district.trim().length < 2) {
      return res.status(400).json({ error: 'District is required.' });
    }

    const VALID_URGENCY = ['normal', 'urgent', 'critical'];
    const safeUrgency = VALID_URGENCY.includes(urgency) ? urgency : 'normal';
    const safeBags = Math.min(Math.max(parseInt(bagsNeeded) || 1, 1), 20);

    const request = new BloodRequest({
      requesterName: requesterName.trim().slice(0, 100),
      phone: phone.trim(),
      bloodGroup,
      hospital: hospital.trim().slice(0, 200),
      district: district.trim().slice(0, 100),
      upazila: upazila ? upazila.trim().slice(0, 100) : '',
      urgency: safeUrgency,
      bagsNeeded: safeBags,
      note: note ? note.trim().slice(0, 500) : ''
    });

    await request.save();

    // ── FIND AND NOTIFY MATCHING DONORS ──────────────────────────
    try {
      const matchingDonors = await User.find({
        status: 'approved',
        role: 'donor',
        district: district.trim(),
        bloodGroup: bloodGroup,
        email: { $exists: true, $ne: '' }
      }).select('name email phone bloodGroup district');

      if (matchingDonors.length > 0) {
        console.log(`🔔 Found ${matchingDonors.length} matching donors in ${district} for blood ${bloodGroup}`);
        notifyDonors(
          { requesterName: requesterName.trim(), phone: phone.trim(), bloodGroup, hospital: hospital.trim(), district: district.trim(), urgency: safeUrgency },
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

    // ── Input validation ────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Valid name is required.' });
    }
    if (!phone || !isValidPhone(phone.trim())) {
      return res.status(400).json({ error: 'A valid Bangladeshi phone number is required.' });
    }
    const safeAge = parseInt(age);
    if (isNaN(safeAge) || safeAge < 1 || safeAge > 120) {
      return res.status(400).json({ error: 'A valid age between 1 and 120 is required.' });
    }
    if (!district || typeof district !== 'string' || district.trim().length < 2) {
      return res.status(400).json({ error: 'District is required.' });
    }
    if (!bloodGroup || !isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({ error: 'A valid blood group is required.' });
    }

    const application = new Thalassemia({
      name: name.trim().slice(0, 100),
      phone: phone.trim(),
      age: safeAge,
      district: district.trim().slice(0, 100),
      bloodGroup,
      transfusionFreq: transfusionFreq ? transfusionFreq.trim().slice(0, 100) : '',
      hospital: hospital ? hospital.trim().slice(0, 200) : '',
      doctorName: doctorName ? doctorName.trim().slice(0, 100) : '',
      note: note ? note.trim().slice(0, 500) : ''
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
    // ── Strict field allowlist — CRITICAL: prevents mass-assignment attacks ──
    // Attackers cannot inject fields like status:'approved' or role:'admin'
    const {
      name,
      phone,
      email,
      dob,
      bloodGroup,
      weight,
      district,
      upazila,
      password,
      healthNote
    } = req.body;

    // ── Input validation ────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Valid name is required.' });
    }
    if (!phone || !isValidPhone(phone.trim())) {
      return res.status(400).json({ error: 'A valid Bangladeshi phone number (11 digits starting with 01) is required.' });
    }
    if (!bloodGroup || !isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({ error: 'A valid blood group is required.' });
    }
    if (!district || typeof district !== 'string' || district.trim().length < 2) {
      return res.status(400).json({ error: 'District is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Hash password — the Mongoose pre-save hook will NOT re-hash because
    // we pass a pre-hashed password and mark the field as unmodified after save.
    // Instead, we set the password directly and let ONLY the pre-save hook handle hashing.
    // The route should NOT hash; the model handles it. Password goes in plain.
    // (Previously the route hashed AND the model hashed = double-hashing bug — now fixed.)

    // Prepare files object
    const files = {};
    const fileTypes = ['bloodReport', 'hbReport', 'nidReport', 'cbcReport', 'infReport', 'certReport'];
    fileTypes.forEach(type => {
      if (req.files && req.files[type] && req.files[type][0]) {
        const file = req.files[type][0];
        files[type] = {
          url: file.path, // Cloudinary URL
          publicId: file.filename // public_id from Cloudinary
        };
      } else {
        files[type] = { url: '', publicId: '' };
      }
    });

    // Create user with EXPLICIT field list only — no mass-assignment
    const user = new User({
      name: name.trim().slice(0, 100),
      phone: phone.trim(),
      email: email ? email.trim().slice(0, 200) : '',
      dob: dob || '',
      bloodGroup,
      weight: weight ? parseFloat(weight) : undefined,
      district: district.trim().slice(0, 100),
      upazila: upazila ? upazila.trim().slice(0, 100) : '',
      password, // Model pre-save hook handles bcrypt hashing
      healthNote: healthNote ? healthNote.trim().slice(0, 500) : '',
      files,
      role: 'donor',     // Always set to donor — cannot be overridden
      status: 'pending'  // Always set to pending — cannot be overridden
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
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;