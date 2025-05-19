const express = require('express');
const router = express.Router();
const cart = require('../models/carts/cart');
const Product = require('../models/products/product');

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await cart.findAll({
      where: { user_id: req.params.userId },
      include: [{
        model: Product,
        attributes: ['productid', 'productname', 'images', 'price']
      }]
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;
    const cartItem = await cart.create({
      user_id: userId,
      product_id: productId,
      quantity,
      price
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Update cart item
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await cart.findByPk(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    await cartItem.update({ quantity });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await cart.findByPk(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    await cartItem.destroy(); // This will now permanently delete the record
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

// Clear all items from user's cart
router.delete('/user/:userId', async (req, res) => {
  try {
    await cart.destroy({
      where: { user_id: req.params.userId }
    });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

module.exports = router;