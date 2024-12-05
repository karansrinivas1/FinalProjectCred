const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload'); // Assuming file upload middleware
const { uploadCSV, getTransactionsByUsername,deleteAllTransactions,getSpendingTrend} = require('../controllers/transactionController');

// Define the route for uploading CSV
router.post('/upload-csv', upload.single('file'), uploadCSV);

// Define the route for getting transactions by username
router.get('/transactions/:username', getTransactionsByUsername);
router.delete('/delete', deleteAllTransactions);
router.post('/transactions/spending-trend', getSpendingTrend);
module.exports = router;
