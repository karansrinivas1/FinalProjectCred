const mongoose = require('mongoose');

// Define CreditCard schema
const creditCardSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Primary key
    cards: [
        {
            cardNumber: { type: String, required: true },
            expiryDate: { type: String, required: true }, // Format: MM/YY
            cvv: { type: String, required: true },
            cardType: { type: String, required: true }, // e.g., Visa, MasterCard
            creditLimit: { type: Number, required: true },
            creditBalance: { type: Number, required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', creditCardSchema);
