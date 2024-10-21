const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');  // Ensure these middlewares are defined

// Routes:
router.get('/', getProducts);                           // Get all products
router.get('/:id', getProductById);                     // Get a product by ID
router.post('/', protect, isAdmin, addProduct);         // Add a new product (Admin only)
router.put('/:id', protect, isAdmin, updateProduct);    // Update a product by ID (Admin only)
router.delete('/:id', protect, isAdmin, deleteProduct); // Delete a product by ID (Admin only)
module.exports = router;
