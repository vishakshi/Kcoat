const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures unique usernames
    minlength: 3, // Minimum length for username
    maxlength: 20, // Maximum length for username
    trim: true, // Removes whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique emails
    lowercase: true, // Convert to lowercase
    trim: true, // Removes whitespace
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum length for password
  },
  isAdmin: {
    type: Boolean,
    default: false, // Default role is not admin
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
});

// Middleware to update the updatedAt field before saving the document
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;

