// src/controllers/forgotPasswordController.js
const forgotPasswordService = require('../services/forgotPasswordService');

// Controller for forgot password
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const message = await forgotPasswordService.sendResetPasswordEmail(email);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { forgotPasswordController };
