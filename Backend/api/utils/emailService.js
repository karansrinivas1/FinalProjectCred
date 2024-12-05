// emailService.js

const mailgun = require('mailgun-js');
require('dotenv').config();
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

// Function to send password reset email
const sendEmail = async (toEmail, resetLink) => {
  const data = {
    from: process.env.MAILGUN_SENDER_EMAIL,  // Sender email
    to: toEmail,                            // Recipient email (this should be a string, not an object)
    subject: 'Password Reset Request',      // Subject line
    text: `Please click the following link to reset your password: ${resetLink}`, // Plain text
    html: `<strong>Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></strong>`, // HTML version
  };

  console.log('Sending email with data:', data);

  try {
    const response = await mg.messages().send(data);
    return response;
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

// Export the function
module.exports = { sendEmail };
