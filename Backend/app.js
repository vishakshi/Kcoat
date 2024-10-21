const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json()); // To handle JSON body parsing

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // specify your frontend origin
    methods: ['GET', 'POST'], // specify allowed methods
    credentials: true // if you need to allow credentials
}));

// Connect to MongoDB
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api', adminRoutes); // Add admin routes

// Simple test route
app.post('/', (req, res) => {
    res.send('CORS is enabled!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
