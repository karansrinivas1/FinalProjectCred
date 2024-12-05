const { OpenAI } = require('openai');  
require('dotenv').config();

// Create an OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your API key is in .env file
});

// Function to get chat response from OpenAI API
const getChatResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Or whichever model you're using
      messages: messages,
    });
    
    // Ensure you're extracting the response correctly
    return response.choices[0].message.content;  // Correctly access the message content
  } catch (error) {
    console.error('Error getting chat response from OpenAI:', error);
    throw new Error('Error fetching chat response');
  }
};

module.exports = { getChatResponse };
