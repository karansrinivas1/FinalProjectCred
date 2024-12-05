const express = require('express');
const router = express.Router();
const { createAccount, getAccount,updateAccountBalance } = require('../controllers/AccountController');

// Create a new account
router.post('/createAccount', createAccount);

// Get account details by username
router.get('/getAccount/:username', getAccount);


// Update account balance by username
router.put('/updateAccount/:username', updateAccountBalance);


module.exports = router;
