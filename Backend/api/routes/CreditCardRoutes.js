const express = require('express');
const { addCreditCard, getCreditCards } = require('../controllers/CreditCardController');

const router = express.Router();

// Route to add a credit card
router.post('/add-card', addCreditCard);

// Route to get credit cards by username
router.get('/:username', getCreditCards);

module.exports = router;
