// api/routes/openaiRoutes.js
const express = require('express');
const router = express.Router();
const { getOpenAIResponse } = require('../controllers/openaiController');

// Define the route to handle OpenAI API queries
router.post('/query', getOpenAIResponse);

module.exports = router;
