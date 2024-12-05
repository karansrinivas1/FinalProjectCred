const express = require('express');
const { resetPassword } = require('../controllers/resetPasswordController');

const router = express.Router();

// Route to handle password reset
router.post('/reset-password', resetPassword);

module.exports = router;
