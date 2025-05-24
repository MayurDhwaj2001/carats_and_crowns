const express = require('express');
const router = express.Router();
const product = require('../models/products/product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get custom products
router.get('/custom', async (req, res) => {
  try {
    const products = await product.findAll({
      where: {
        Type: 'Custom'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching custom products:', error);
    res.status(500).json({ message: 'Error fetching custom products' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productItem = await product.findByPk(req.params.id);
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(productItem);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  try {
    const productItem = await product.findByPk(req.params.id);
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product with new data
    await productItem.update({
      ProductName: req.body.ProductName,
      Description: req.body.Description,
      GoldCarat: req.body.GoldCarat,
      Weight: req.body.Weight,
      Price: req.body.Price,
      Type: req.body.Type,
      Metal: req.body.Metal,
      Stones: req.body.Stones,
      Images: req.body.Images,
      UpdatedBy: req.body.UpdatedBy
    });

    res.json({ message: 'Product updated successfully', product: productItem });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const productItem = await product.findByPk(req.params.id);
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await productItem.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;