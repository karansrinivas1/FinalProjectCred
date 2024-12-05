const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
  content: { type: String, required: true },
  query: { type: String, required: false },  // Store the user query separately
  transactionDetails: { type: [Object], required: false },  // Store transaction data (optional)
}, { timestamps: true });

conversationSchema.index({ username: 1 }); // Index username for faster querying

module.exports = mongoose.model('Conversation', conversationSchema);
