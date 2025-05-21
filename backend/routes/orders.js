const express = require('express');
const router = express.Router();
const Order = require('../models/orders/order');
const OrderItem = require('../models/orders/orderItem');
const Product = require('../models/products/product');
const { authenticateToken } = require('../services/auth/authMiddleware');

// Get user's orders
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.params.userId },
      include: [{
        model: OrderItem,
        include: [{
          model: Product,
          attributes: ['productname', 'images']
        }]
      }],
      order: [['order_date', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, items, total_amount, payment_id } = req.body;
    
    const order = await Order.create({
      user_id,
      total_amount,
      payment_id,
      status: 'Processing Order'
    });

    // Create order items
    await Promise.all(items.map(item => {
      return OrderItem.create({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      });
    }));

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

module.exports = router;