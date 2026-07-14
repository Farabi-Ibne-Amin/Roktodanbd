const mongoose = require('mongoose');

// Donation (bKash) Schema
const donationSchema = new mongoose.Schema({
  paymentID: { type: String },
  trxID: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  donorName: { type: String },
  donorEmail: { type: String },  // Stored at payment create time for receipt emails
  donorPhone: { type: String },
  purpose: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);