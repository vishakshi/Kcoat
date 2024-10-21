const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin user by email and check if they are an admin
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) return res.status(400).json({ message: 'Invalid admin credentials.' });

    // Compare the provided password with the hashed password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid admin credentials.' });

    // Generate a JWT token with the admin's id and isAdmin flag
    const token = jwt.sign(
      { _id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { adminLogin };
