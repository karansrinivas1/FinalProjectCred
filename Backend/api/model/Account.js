const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true},
  accountNumber: { type: String, required: true,unique: true },
  accountType: { type: String, required: true, enum: ['Checking', 'Savings', 'Credit'], default: 'Checking' },
  accountBalance: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Account', accountSchema);

