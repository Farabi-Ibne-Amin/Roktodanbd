require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// Use Google DNS resolver - might help with MongoDB SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://blood-donation-gls8.onrender.com',
  'https://roktodanbd.netlify.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── SECURITY MIDDLEWARES ──────────────────────────────────────────────────────
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// 1. Helmet headers protection (disabling CSP to prevent inline styling block issues in SPA)
app.use(helmet({
  contentSecurityPolicy: false,
}));

// 2. Prevent MongoDB Operator Injection
app.use(mongoSanitize());

// 3. XSS HTML-strip sanitization middleware for request inputs
const stripHtmlTags = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, ''); // Strips out all HTML tags
};
const sanitizePayload = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = stripHtmlTags(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizePayload(obj[key]);
    }
  }
  return obj;
};
app.use((req, res, next) => {
  if (req.body) sanitizePayload(req.body);
  if (req.query) sanitizePayload(req.query);
  if (req.params) sanitizePayload(req.params);
  next();
});

// 4. Rate Limiting protection
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per 15 minutes
  message: { error: 'Too many requests from this IP, please try again later.' }
});
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per 15 minutes
  message: { error: 'Too many authentication attempts, please try again in 15 minutes.' }
});

app.use('/api/', generalRateLimiter);
app.use('/api/admin/login', authRateLimiter);
app.use('/api/user/login', authRateLimiter);
app.use('/api/setup', authRateLimiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const publicRoutes = require('./routes/public');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const donationRoutes = require('./routes/donations');

app.use('/api', publicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);

// SPA fallback for /admin/
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Fallback for all other routes (for frontend SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Custom global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global Server Error caught:', err.stack || err);
  
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    details: err.details || err
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Auto-setup super admin if SETUP_TOKEN is provided
  // We'll handle this in a separate route or script
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Auto-setup super admin endpoint
app.post('/api/setup', async (req, res) => {
  const { token, email, password, name } = req.body;
  if (token !== process.env.SETUP_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const Admin = require('./models/index').Admin;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await require('bcryptjs').hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, name, role: 'superadmin' });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});