const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/UserRoute');
const forgotPasswordRoutes = require('./api/routes/forgotPasswordRoutes');
const ResetPasswordRoutes = require('./api/routes/resetPasswordRoute');
const cors = require('cors');
const http = require('http'); // Add this to use http.createServer
require('dotenv').config();  // Load environment variables
const creditCardRoutes = require('./api/routes/CreditCardRoutes');
const transactionRoutes = require('./api/routes/transactionRoutes');
const openaiRoutes = require('./api/routes/openaiRoutes'); // Import the new OpenAI routes
const socketIo = require('socket.io');
const accountRoutes = require('./api/routes/accountRoutes');
const billRoutes = require('./api/routes/billRoutes');


// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server to attach to Socket.IO
const io = socketIo(server); // Attach socket.io to the server

// Allow CORS for your frontend's origin
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json()); 

// Routes
app.use('/user', userRoutes);  // User-related routes
app.use('/user', forgotPasswordRoutes); // Forgot password route
app.use('/api', ResetPasswordRoutes); // Forgot password route
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/', transactionRoutes); // Transactions-related routes
app.use('/api/openai', openaiRoutes); // OpenAI routes for handling AI queries
app.use('/api/account', accountRoutes);
app.use('/api/bills', billRoutes);

// MongoDB connection (ensure write concern is set)
const uri = process.env.MONGO_URI; // Mongo URI from .env file

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: "majority" }, // Ensure write concern mode is 'majority'
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process in case of connection failure
});

// Socket.IO event handling (example for sending data)
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Example of broadcasting a message (you can customize this for transactions or AI queries)
    socket.on('transaction_data', (data) => {
        console.log('Transaction data received:', data);
        // You can also emit a response back to the frontend if needed
        socket.emit('transaction_response', { message: 'Data processed successfully' });
    });
});

// Generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
