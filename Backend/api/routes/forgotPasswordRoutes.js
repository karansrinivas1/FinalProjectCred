// src/routes/forgotPasswordRoutes.js
const express = require('express');
const router = express.Router();
const { forgotPasswordController } = require('../controllers/forgotPasswordController');

// Route to handle forgot password
router.post('/forgot-password', forgotPasswordController);

module.exports = router;
