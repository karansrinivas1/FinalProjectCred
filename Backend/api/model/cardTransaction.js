// models/cardTransaction.js

const mongoose = require('mongoose');

const cardTransactionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    transaction_id: { type: String, required: true, unique: true },
    card_number: { type: String, required: true },
    transaction_amount: { type: Number, required: true },
    card_type: { type: String, required: true },
    transaction_date: { type: Date, required: true },
    merchant_type: { type: String, required: true },
    transaction_status: { type: String, required: true },
    transaction_time: { type: Date, default: Date.now }
});

const CardTransaction = mongoose.model('CardTransaction', cardTransactionSchema);

module.exports = CardTransaction;
