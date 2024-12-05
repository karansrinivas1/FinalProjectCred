// models/Bill.js
const mongoose = require('mongoose');

// Define transaction schema for the bill
const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  transactionType: { type: String, enum: ['online', 'retail','restaurant','grocery'], required: true },  // payment or refund
  transactionDate: { type: Date, required: true }  // Date when the transaction occurred
});

// Define the Bill schema
const billSchema = new mongoose.Schema({
  bill_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  total_amount: { type: Number, required: true },
  pending_amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  transactions: [transactionSchema]  // Array of transactions related to the bill
});

// Create the Bill model
module.exports = mongoose.model('Bill', billSchema);
