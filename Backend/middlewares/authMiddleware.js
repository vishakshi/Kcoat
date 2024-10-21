const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes and check authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach the user to the request object (excluding the password)
      req.user = await User.findById(decoded._id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error with token: ', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If token is not provided
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  };
  
  module.exports = { protect, isAdmin };

