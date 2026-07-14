const express = require('express');
const router = express.Router();
const { Donation } = require('../models');
const axios = require('axios');
const { sendDonationReceiptEmail } = require('../utils/email');

// Helper to request bKash grant authorization token
const getBkashToken = async () => {
  const response = await axios.post(`${process.env.BKASH_BASE_URL}/checkout/token/grant`, {
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
  }, {
    headers: {
      'Content-Type': 'application/json',
      'username': process.env.BKASH_USERNAME,
      'password': process.env.BKASH_PASSWORD
    }
  });
  return response.data.id_token;
};

// POST /api/donations/donate/create — Create real bKash tokenized payment
router.post('/donate/create', async (req, res) => {
  try {
    const { amount, payerReference, donorEmail } = req.body;

    if (!amount || !payerReference) {
      return res.status(400).json({ error: 'Amount and payerReference are required' });
    }

    // 1. Get authorization token
    const idToken = await getBkashToken();

    // 2. Initialize bKash Checkout Payment Request
    const response = await axios.post(`${process.env.BKASH_BASE_URL}/checkout/payment/create`, {
      mode: '0011',
      payerReference: payerReference.substring(0, 15), // bKash reference max limit is 15
      callbackURL: process.env.BKASH_CALLBACK_URL,
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken,
        'X-APP-Key': process.env.BKASH_APP_KEY
      }
    });

    const paymentData = response.data;
    
    // Validate response code
    if (paymentData.statusCode && paymentData.statusCode !== '0000') {
      return res.status(400).json({ error: paymentData.statusMessage || 'bKash PGW initialization failed' });
    }

    // 3. Save pending transaction to MongoDB
    const donation = new Donation({
      paymentID: paymentData.paymentID,
      amount: parseFloat(amount),
      status: 'initiated',
      purpose: 'Donation to RoktoDanBD',
      donorName: payerReference,
      donorEmail: donorEmail || ''
    });

    await donation.save();

    // Return the bkash checkout portal URL
    res.json({
      paymentID: paymentData.paymentID,
      bkashURL: paymentData.bkashURL,
      amount: paymentData.amount
    });

  } catch (err) {
    console.error('bKash creation error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Internal connection error to bKash PGW gateway' });
  }
});

// GET /api/donations/donate/callback — bKash callback handler
router.get('/donate/callback', async (req, res) => {
  const { paymentID, status } = req.query;

  if (!paymentID) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }

  try {
    // Handle cancellation
    if (status === 'cancel') {
      await Donation.findOneAndUpdate({ paymentID }, { status: 'cancelled' });
      return res.redirect(`/donation-cancel?paymentID=${paymentID}`);
    }

    // Handle failure
    if (status === 'failure') {
      await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
      return res.redirect(`/donation-failure?paymentID=${paymentID}`);
    }

    // Handle payment completion verification
    if (status === 'success') {
      // 1. Get authentication token
      const idToken = await getBkashToken();

      // 2. Execute Payment
      const response = await axios.post(`${process.env.BKASH_BASE_URL}/checkout/payment/execute`, {
        paymentID
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken,
          'X-APP-Key': process.env.BKASH_APP_KEY
        }
      });

      const executeData = response.data;

      // Check if execute completed successfully
      if (executeData.statusCode && executeData.statusCode === '0000') {
        const donation = await Donation.findOneAndUpdate(
          { paymentID },
          {
            status: 'completed',
            trxID: executeData.trxID,
            donorPhone: executeData.customerMsisdn || ''
          },
          { new: true }
        );

        // Send bKash donation receipt email asynchronously
        if (donation && donation.donorEmail) {
          sendDonationReceiptEmail({
            donorName: donation.donorName,
            donorEmail: donation.donorEmail,
            amount: donation.amount,
            trxID: executeData.trxID,
            paymentID
          }).catch(err => console.error('❌ Donation receipt email error:', err));
        }

        return res.redirect(`/donation-success?paymentID=${paymentID}`);
      } else {
        // Verification / execute failed
        await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
        return res.redirect(`/donation-failure?paymentID=${paymentID}`);
      }
    }

    // Fallback failure redirect
    res.redirect(`/donation-failure?paymentID=${paymentID}`);

  } catch (err) {
    console.error('bKash execute callback error:', err.response ? err.response.data : err.message);
    res.status(500).send('Checkout execution callback handler failed.');
  }
});

// GET /api/donations/donate/cancel — Fallback endpoint redirect
router.get('/api/donations/donate/cancel', async (req, res) => {
  const { paymentID } = req.query;
  await Donation.findOneAndUpdate({ paymentID }, { status: 'cancelled' });
  res.redirect(`/donation-cancel?paymentID=${paymentID}`);
});

// GET /api/donations/donate/failure — Fallback endpoint redirect
router.get('/api/donations/donate/failure', async (req, res) => {
  const { paymentID } = req.query;
  await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
  res.redirect(`/donation-failure?paymentID=${paymentID}`);
});

module.exports = router;