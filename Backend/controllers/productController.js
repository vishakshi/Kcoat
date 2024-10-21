const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /baseUrl/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get a single product by ID
// @route   GET /baseUrl/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id; // Log the incoming ID
    console.log('Product ID:', productId);

    const product = await Product.findById(productId);
    console.log('Fetched Product:', product);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error); // Log the error
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// @desc    Add a new product (Admin only)
// @route   POST /baseUrl/products
// @access  Private/Admin
const addProduct = async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  // Validate required fields
  if (!name || !description || price == null || !category || stock == null || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    // Save the new product to the database
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error adding product:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};


// @desc    Update an existing product (Admin only)
// @route   PUT /baseUrl/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.imageUrl = imageUrl || product.imageUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /baseUrl/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
