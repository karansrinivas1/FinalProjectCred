// utils/fileUpload.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the directory where uploaded files will be stored
const uploadDir = path.join(__dirname, '../uploads');

// Check if the uploads directory exists, and create it if not
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure that the uploads directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use the original file name or a custom name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
