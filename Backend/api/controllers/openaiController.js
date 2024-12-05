const { getChatResponse } = require('../services/openaiService');
const { getTransactionsByUsernameOpenAi } = require('./transactionController');
const { saveUserQuery } = require('../services/conversationService');

const getOpenAIResponse = async (req, res) => {
  const { username, query } = req.body;
  console.log("Received body:", req.body);  // Log the incoming request body

  try {
    // Ensure required fields are provided
    if (!username || !query) {
      return res.status(400).json({ message: 'Username and query are required' });
    }

    // Fetch transaction details for the user
    const transactions = await getTransactionsByUsernameOpenAi(username);

    // Log to see the transactions data
    console.log('Transactions:', transactions);

    // Map transaction details and categorize them by type, amount, etc.
    const transactionDetails = transactions.map(tx => ({
      transaction_id: tx.transaction_id,
      amount: tx.transaction_amount,
      card_type: tx.card_type,
      status: tx.transaction_status,
      date: tx.transaction_date,
    }));

    // Construct system message with the transaction data for OpenAI
    const systemMessage = {
      role: 'system',
      content: `You are a financial assistant. Here are the recent transactions for ${username}: \n` + 
               transactionDetails.map(tx => `Transaction ID: ${tx.transaction_id}, Amount: ${tx.amount}, Type: ${tx.card_type}, Date: ${tx.date}`).join('\n') + 
               `\nBased on this data, can you analyze their spending habits and trends? Identify areas where they are spending more or give recommendations on how they can save.`
    };

    const userMessage = {
      role: 'user',
      content: query,  // The user's question/query
    };

    const messages = [systemMessage, userMessage];

    // Get response from OpenAI API
    const openAIResponse = await getChatResponse(messages);

    console.log('OpenAI Response:', openAIResponse);  // Log to see the full response

    // Save conversation to the database
    await saveUserQuery(username, query, openAIResponse);

    // Send the response back to the frontend
    return res.status(200).json({ response: openAIResponse });

  } catch (error) {
    console.error("Error getting chat response from OpenAI:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getOpenAIResponse };
