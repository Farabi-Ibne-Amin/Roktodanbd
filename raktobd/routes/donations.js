const express = require('express');
const router = express.Router();
const { Donation } = require('../models');
const axios = require('axios');
const { sendDonationReceiptEmail } = require('../utils/email');

// ── bKash input validation helpers ───────────────────────────────────────────

/** Validates that a paymentID is safe to use in DB queries (alphanumeric + hyphens only) */
const isValidPaymentID = (id) => typeof id === 'string' && /^[A-Za-z0-9\-_]{5,64}$/.test(id);

/** Validates donation amount is a reasonable positive number */
const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 10 && num <= 100000;
};

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

    // Validate amount is within safe bounds
    if (!isValidAmount(amount)) {
      return res.status(400).json({ error: 'Amount must be between 10 and 100,000 BDT.' });
    }

    // Sanitize payer reference
    const safePayerRef = typeof payerReference === 'string'
      ? payerReference.trim().slice(0, 15)
      : '';
    if (!safePayerRef) {
      return res.status(400).json({ error: 'Invalid payerReference.' });
    }

    // Validate email if provided
    const safeEmail = typeof donorEmail === 'string' ? donorEmail.trim().slice(0, 200) : '';

    // 1. Get authorization token
    const idToken = await getBkashToken();

    // 2. Initialize bKash Checkout Payment Request
    const response = await axios.post(`${process.env.BKASH_BASE_URL}/checkout/payment/create`, {
      mode: '0011',
      payerReference: safePayerRef,
      callbackURL: process.env.BKASH_CALLBACK_URL,
      amount: parseFloat(amount).toFixed(2),
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
      donorName: safePayerRef,
      donorEmail: safeEmail
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

  if (!paymentID || !isValidPaymentID(paymentID)) {
    return res.status(400).json({ error: 'Invalid or missing Payment ID.' });
  }

  try {
    // Handle cancellation
    if (status === 'cancel') {
      await Donation.findOneAndUpdate({ paymentID }, { status: 'cancelled' });
      return res.redirect(`/donation-cancel?paymentID=${encodeURIComponent(paymentID)}`);
    }

    // Handle failure
    if (status === 'failure') {
      await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
      return res.redirect(`/donation-failure?paymentID=${encodeURIComponent(paymentID)}`);
    }

    // Handle payment completion verification
    if (status === 'success') {
      // ── Idempotency guard: prevent re-execution of already-completed payments ──
      const existingDonation = await Donation.findOne({ paymentID });
      if (existingDonation && existingDonation.status === 'completed') {
        console.log(`⚠️ Duplicate callback for already-completed payment: ${paymentID}`);
        return res.redirect(`/donation-success?paymentID=${encodeURIComponent(paymentID)}`);
      }

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

        return res.redirect(`/donation-success?paymentID=${encodeURIComponent(paymentID)}`);
      } else {
        // Verification / execute failed
        await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
        return res.redirect(`/donation-failure?paymentID=${encodeURIComponent(paymentID)}`);
      }
    }

    // Fallback failure redirect
    res.redirect(`/donation-failure?paymentID=${encodeURIComponent(paymentID)}`);

  } catch (err) {
    console.error('bKash execute callback error:', err.response ? err.response.data : err.message);
    res.status(500).send('Checkout execution callback handler failed.');
  }
});

// GET /api/donations/donate/cancel — Fallback endpoint redirect
router.get('/donate/cancel', async (req, res) => {
  const { paymentID } = req.query;
  if (!paymentID || !isValidPaymentID(paymentID)) {
    return res.redirect('/donation-cancel');
  }
  await Donation.findOneAndUpdate({ paymentID }, { status: 'cancelled' });
  res.redirect(`/donation-cancel?paymentID=${encodeURIComponent(paymentID)}`);
});

// GET /api/donations/donate/failure — Fallback endpoint redirect
router.get('/donate/failure', async (req, res) => {
  const { paymentID } = req.query;
  if (!paymentID || !isValidPaymentID(paymentID)) {
    return res.redirect('/donation-failure');
  }
  await Donation.findOneAndUpdate({ paymentID }, { status: 'failed' });
  res.redirect(`/donation-failure?paymentID=${encodeURIComponent(paymentID)}`);
});

module.exports = router;