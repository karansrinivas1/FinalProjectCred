const CreditCard = require('../model/CreditCard');

// Add a credit card
const addCreditCard = async (req, res) => {
    const { username, cardNumber, expiryDate, cvv, cardType, creditLimit, creditBalance } = req.body;

    try {
        // Find the user in the database
        let userCards = await CreditCard.findOne({ username });

        if (!userCards) {
            // If no user exists, create a new record
            userCards = new CreditCard({
                username,
                cards: [{ cardNumber, expiryDate, cvv, cardType, creditLimit, creditBalance }],
            });
        } else {
            // Add the new card to the user's cards array
            userCards.cards.push({ cardNumber, expiryDate, cvv, cardType, creditLimit, creditBalance });
        }

        // Save the updated data
        await userCards.save();

        res.status(200).json({ message: 'Credit card added successfully', data: userCards });
    } catch (error) {
        console.error('Error adding credit card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get credit cards by username
const getCreditCards = async (req, res) => {
    const { username } = req.params;

    try {
        const userCards = await CreditCard.findOne({ username });

        if (!userCards) {
            return res.status(404).json({ message: 'No credit cards found for this user' });
        }

        res.status(200).json({ message: 'Credit cards retrieved successfully', data: userCards });
    } catch (error) {
        console.error('Error retrieving credit cards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addCreditCard, getCreditCards };
