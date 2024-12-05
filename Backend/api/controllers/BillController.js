// controllers/BillController.js
const Bill = require('../model/Bill');

// Create a new bill
async function createBill(req, res) {
    const { username, bill_id, total_amount, transactions } = req.body;
  
    try {
      const newBill = new Bill({
        bill_id,
        username,
        total_amount,
        pending_amount: total_amount,
        transactions: transactions.map(tx => ({
          ...tx,
          transactionDate: new Date(tx.transactionDate)
        }))
      });
  
      await newBill.save();
      res.status(201).json({ message: 'Bill created successfully', bill: newBill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating bill' });
    }
  }


// controllers/BillController.js
async function getBill(req, res) {
    const { username, bill_id } = req.params;
  
    try {
      const bill = await Bill.findOne({ bill_id, username });
  
      if (!bill) {
        return res.status(404).json({ error: 'Bill not found for this user' });
      }
  
      res.json({
        bill_id: bill.bill_id,
        username: bill.username,
        total_amount: bill.total_amount,
        pending_amount: bill.pending_amount,
        status: bill.status,
        transactions: bill.transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching bill details' });
    }
  }
  

  // controllers/BillController.js
  async function updateBill(req, res) {
    const { username, bill_id } = req.params;
    const { payment_amount } = req.body;  // Only using payment amount
  
    try {
      const bill = await Bill.findOne({ bill_id, username });
  
      if (!bill) {
        return res.status(404).json({ error: 'Bill not found for this user' });
      }
  
      // Update the pending amount
      const newPendingAmount = bill.pending_amount - payment_amount;
  
      if (newPendingAmount < 0) {
        return res.status(400).json({ error: 'Payment exceeds the pending amount' });
      }
  
      // Update the bill with the new pending amount
      bill.pending_amount = newPendingAmount;
  
      // If fully paid, update status
      if (newPendingAmount === 0) {
        bill.status = 'paid';
      }
  
      // Save the updated bill
      await bill.save();
      res.json({ message: 'Bill updated successfully', bill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating bill' });
    }
  }

  async function deleteBill(req, res) {
    const { username, bill_id } = req.params;
  
    try {
      const bill = await Bill.findOneAndDelete({ bill_id, username });
  
      if (!bill) {
        return res.status(404).json({ error: 'Bill not found for this user' });
      }
  
      res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting bill' });
    }
  }
  
  async function getBillSummary(req, res) {
    const { username } = req.params;
    
    try {
      // Find all bills for the given username
      const bills = await Bill.find({ username });
  
      if (!bills || bills.length === 0) {
        return res.status(404).json({ error: 'No bills found for this user' });
      }
  
      // Map the bills to only return bill_id and pending_amount
      const billSummaries = bills.map(bill => ({
        bill_id: bill.bill_id,
        pending_amount: bill.pending_amount,
      }));
  
      res.json({ bills: billSummaries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching bill summaries' });
    }
  }
  
  module.exports = { createBill, getBill, updateBill, deleteBill, getBillSummary };
 