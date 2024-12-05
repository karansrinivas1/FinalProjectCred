// routes/billRoutes.js
const express = require('express');
const router = express.Router();
const { createBill, getBill, updateBill, deleteBill,getBillSummary } = require('../controllers/BillController');

// Create a new bill
router.post('/create', createBill);

// Get bill by username and bill_id
router.get('/get/:username/:bill_id', getBill);

// Update bill by username and bill_id
router.put('/update/:username/:bill_id', updateBill);

// Delete bill by username and bill_id
router.delete('/delete/:username/:bill_id', deleteBill);

// Get bill summary (bill_id and pending amount) by username
router.get('/getSummary/:username', getBillSummary);


module.exports = router;
