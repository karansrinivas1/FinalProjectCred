const Account = require('../model/Account');

// Create a new account
async function createAccount(req, res) {
  const { username, accountNumber, accountType, accountBalance } = req.body;

  try {
    // Check if account already exists for the user
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({ error: 'Account already exists for this user' });
    }

    // Create a new account
    const newAccount = new Account({
      username,
      accountNumber,
      accountType,
      accountBalance,
    });

    await newAccount.save();
    res.status(201).json({ message: 'Account created successfully', newAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}

async function getAccount(req, res) {
    const { username } = req.params;
  
    try {
      // Find all accounts that match the username
      const accounts = await Account.find({ username });
  
      // Check if any accounts are found
      if (accounts.length === 0) {
        return res.status(404).json({ message: 'No accounts found for this username' });
      }
  
      // Return the found accounts
      res.json({ accounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }
  

  async function updateAccountBalance(req, res) {
    const { username } = req.params;  // Get the username from request params
    const { accountNumber, accountBalance } = req.body;  // Get accountNumber and new accountBalance from request body

    try {
      // Find the account by username and accountNumber
      const account = await Account.findOne({ username, accountNumber });  // Query by both username and accountNumber
      
      // If the account doesn't exist, return an error
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
  
      // Update the account balance
      account.accountBalance = accountBalance;
  
      // Save the updated account
      await account.save();
  
      res.json({ message: 'Account balance updated successfully', account });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
}


module.exports = { createAccount ,getAccount,updateAccountBalance};
