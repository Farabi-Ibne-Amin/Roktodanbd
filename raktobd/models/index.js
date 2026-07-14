const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  dob: { type: String },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  weight: { type: Number },
  district: { type: String, required: true },
  upazila: { type: String },
  role: { type: String, enum: ['donor', 'receiver'], default: 'donor' },
  password: { type: String, required: true },
  healthNote: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended', 'deleted'], default: 'pending' },
  adminNote: { type: String },
  files: {
    bloodReport: { url: String, publicId: String },
    hbReport: { url: String, publicId: String },
    nidReport: { url: String, publicId: String },
    cbcReport: { url: String, publicId: String },
    infReport: { url: String, publicId: String },
    certReport: { url: String, publicId: String },
  },
  lastDonated: { type: Date },
  donationCount: { type: Number, default: 0 },
  reactivateAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate auth token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

// Blood Request Schema
const bloodRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  hospital: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String },
  urgency: { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
  bagsNeeded: { type: Number, default: 1 },
  note: { type: String },
  status: { type: String, enum: ['open', 'fulfilled', 'expired', 'closed', 'deleted'], default: 'open' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// DonationLog Schema
const donationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['full', 'platelet', 'plasma'], default: 'full' },
  hospital: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'verified' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password for admin
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method for admin
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate auth token for admin
adminSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

// Thalassemia Schema
const thalassemiaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  district: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  transfusionFreq: { type: String },
  hospital: { type: String },
  doctorName: { type: String },
  note: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'assisted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Import Donation model from donation.js
const Donation = require('./donation');

// Create models
const User = mongoose.model('User', userSchema);
const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
const DonationLog = mongoose.model('DonationLog', donationLogSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Thalassemia = mongoose.model('Thalassemia', thalassemiaSchema);

module.exports = {
  User,
  BloodRequest,
  DonationLog,
  Admin,
  Thalassemia,
  Donation
};