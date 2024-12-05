const Conversation = require('../model/conversation'); // Model to interact with the DB

// Function to get all previous conversations for a given user
const getConversationByUsername = async (username) => {
  try {
    // Find all conversations for the user, sorted by date
    const conversations = await Conversation.find({ username }).sort({ createdAt: 1 });

    // Return the conversation history as an array of messages
    return conversations.map(convo => ({
      role: convo.role,
      content: convo.content,
    }));
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw new Error('Failed to fetch conversation history');
  }
};

// Function to save user query and response to DB (if not already in place)
const saveUserQuery = async (username, query, aiResponse) => {
    try {
      // Create a new conversation entry with both user and assistant messages
      const userMessage = new Conversation({
        username,
        role: 'user',
        content: query,
      });
  
      const assistantMessage = new Conversation({
        username,
        role: 'assistant',
        content: aiResponse,
      });
  
      // Save both user and assistant messages
      await userMessage.save();
      await assistantMessage.save();
  
      console.log("Conversation saved successfully");
    } catch (error) {
      console.error("Error saving conversation:", error);
      throw new Error('Failed to save conversation');
    }
  };
  
module.exports = { getConversationByUsername, saveUserQuery };
