const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const CardTransaction = require('../model/cardTransaction');

// Function to handle CSV file upload and insertion into MongoDB
const uploadCSV = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename); // Path to the uploaded file

  let transactions = [];

  // Use csv-parser to read and parse the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const transaction = {
        username: data.username,
        transaction_id: data.transaction_id,
        card_number: data.card_number,
        transaction_amount: parseFloat(data.transaction_amount),
        card_type: data.card_type,
        transaction_date: new Date(data.transaction_date),
        merchant_type: data.merchant_type,
        transaction_status: data.transaction_status,
        transaction_time: new Date()
      };
      transactions.push(transaction);
    })
    .on('end', async () => {
      try {
        // Insert all parsed transactions into MongoDB
        await CardTransaction.insertMany(transactions);
        fs.unlinkSync(filePath); // Remove the uploaded file after processing
        res.status(200).json({ message: 'CSV data uploaded and inserted successfully!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting data into the database' });
      }
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'Error processing the CSV file' });
    });
};

// Function to get all transactions based on username
const getTransactionsByUsername = async (req, res) => {
    const { username } = req.params; // Get the username from URL parameter


    try {
        // Find transactions by username
       
        const transactions = await CardTransaction.find({ username });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this username' });
        }

        // Return the transactions
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

const deleteAllTransactions = async (req, res) => {
    try {
        // Delete all transactions in the CardTransaction collection
        const result = await CardTransaction.deleteMany({});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No transactions to delete' });
        }

        return res.status(200).json({ message: `${result.deletedCount} transactions deleted from the database` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting transactions' });
    }
};

const getSpendingTrend = async (req, res) => {
    const { username, period } = req.body; // Use req.body for POST data
   
    try {
        // Define the match criteria based on username
        let match = { username };

        // Define the group by field for aggregation based on the period
        let groupBy;
        switch (period) {
            case 'day':
                groupBy = { $dayOfYear: "$transaction_date" };
                break;
            case 'week':
                groupBy = { $week: "$transaction_date" };
                break;
            case 'month':
                groupBy = { $month: "$transaction_date" };
                break;
            case 'year':
                groupBy = { $year: "$transaction_date" };
                break;
            case '5Y': // For 5 years period, you might use a range logic.
                groupBy = { $year: "$transaction_date" }; // Adjust the range logic based on your needs
                break;
            default:
                return res.status(400).json({ message: 'Invalid period specified' });
        }

        // Aggregation pipeline
        const spendingTrend = await CardTransaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupBy,
                    totalAmount: { $sum: "$transaction_amount" },
                }
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);

        if (spendingTrend.length === 0) {
            return res.status(200).json({ message: 'No transactions found for this username' });
        }

        // Send response with the grouped data
        res.status(200).json(spendingTrend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching spending trend' });
    }
};


const getTransactionsByUsernameOpenAi = async (username) => {
    try {

        console.log("username:",username);
        // Find transactions by username
        const transactions = await CardTransaction.find({ username });

        if (!transactions || transactions.length === 0) {
            throw new Error('No transactions found for this username');
        }

        return transactions; // Return the transactions if found
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching transactions');
    }
};

// Use POST for the spending-trend route





// Export the functions
module.exports = {
    uploadCSV,
    getTransactionsByUsername,
    deleteAllTransactions,
    getSpendingTrend,
    getTransactionsByUsernameOpenAi
};
