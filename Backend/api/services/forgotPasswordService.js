const crypto = require('crypto');
const User = require('../model/User');
const emailService = require('../utils/emailService');  // for sending emails

// Function to generate reset password token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');  // Generates a 40-character random string
};

// Service function to handle forgotten password logic
const sendResetPasswordEmail = async (email) => {
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('No user found with this email');
  }

  // Generate reset password token
  const token = generateResetToken();
  
  // Set the token and its expiration date (1 hour expiration)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds
  await user.save();

  // Construct reset URL
  const resetUrl = `http://localhost:3001/reset-password/${token}`;

  // Send the reset email (this is where we use the external email service)
  const emailContent = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
  `;

  try {
    await emailService.sendEmail(email, resetUrl);  // Correctly pass email and reset URL
    return 'Password reset link sent to your email';
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendResetPasswordEmail };
