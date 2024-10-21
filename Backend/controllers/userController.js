const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  // Validate request body
  if (!username || !email || !password) {
    return res.status(400).send('Username, email, and password are required.');
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).send('User already registered.');

    // Create new user
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      isAdmin: isAdmin || false // Default to false if not provided
    });

    // Save user to the database
    await user.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

// User Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');

    // Create and sign JWT
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Optional: Token expiration
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const admin = await User.findOne({ username, isAdmin: true });
    if (!admin) return res.status(400).send('Invalid admin credentials.');

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).send('Invalid admin credentials.');

    // Create and sign JWT
    const token = jwt.sign({ _id: admin._id, isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Optional: Token expiration
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

module.exports = { registerUser, loginUser, adminLogin };
