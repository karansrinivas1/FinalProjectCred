const User = require('../model/User');
const crypto = require('crypto');

// Function to reset the password
const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the user by the reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Ensure token is not expired
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        user.password = password; // You should hash this password before saving it
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the reset expiration time

        await user.save();

        return res.json({ message: 'Password successfully reset. Please login with your new password.' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

module.exports = { resetPassword };
