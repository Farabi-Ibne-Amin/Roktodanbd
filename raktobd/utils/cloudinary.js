const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Allowed file extensions and MIME types (no doc/docx to block macro-enabled files)
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// File filter — rejects any file that isn't an image or PDF
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (ALLOWED_EXTENSIONS.includes(ext) && ALLOWED_MIMETYPES.includes(mime)) {
    cb(null, true); // Accept
  } else {
    cb(new Error(`File type not allowed. Only JPG, PNG, and PDF files are accepted.`), false);
  }
};

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'raktodb/medical',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }] // Increased limit for document readability
  }
});

// Initialize Multer with storage, file size limit (5MB), and file type filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 6                   // Max 6 files at once
  },
  fileFilter
});

module.exports = { upload };