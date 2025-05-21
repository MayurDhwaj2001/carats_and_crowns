const express = require('express');
const router = express.Router();
const Order = require('../models/orders/order');
const OrderItem = require('../models/orders/orderItem');
const Product = require('../models/products/product');
const { authenticateToken } = require('../services/auth/authMiddleware');
const { sendOrderConfirmation, sendTrackingUpdate } = require('../services/emailService');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

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
// Update the create order route
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, items, total_amount, payment_id } = req.body;
    
    // Create order first
    const order = await Order.create({
      user_id,
      total_amount,
      payment_id,
      status: 'Processing Order'
    });

    // Create order items with proper error handling
    const orderItems = [];
    for (const item of items) {
      try {
        const product = await Product.findByPk(item.id);
        if (!product) {
          console.error(`Product not found: ${item.id}`);
          continue;
        }

        const orderItem = await OrderItem.create({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        });
        orderItems.push({
          ...orderItem.toJSON(),
          product: product.toJSON()
        });
      } catch (itemError) {
        console.error('Error creating order item:', itemError);
      }
    }

    // Get user details
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Send confirmation email with proper error handling
    const sendEmail = async () => {
      try {
        await sendOrderConfirmation(user, {
          ...order.toJSON(),
          order_items: orderItems
        }, orderItems);
        console.log('Order confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Store failed email attempt in database or queue for retry
      }
    };

    // Send email asynchronously without waiting
    sendEmail().catch(console.error);

    // Send immediate response
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order.toJSON(),
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// Add this new route for cancelling orders
// Update the cancel order route
router.post('/cancel/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Processing Order') {
      return res.status(400).json({ message: 'Only processing orders can be cancelled' });
    }

    if (!order.payment_id) {
      return res.status(400).json({ message: 'No payment ID found for this order' });
    }

    try {
      // Process refund with basic parameters
      const refund = await razorpay.payments.refund(order.payment_id, {
        amount: order.total_amount * 100, // Convert to paise
        speed: 'normal'
      });

      // Update order status
      await order.update({
        status: 'Cancelled',
        refund_id: refund.id
      });

      res.json({
        message: 'Order cancelled and refund initiated',
        refund_id: refund.id
      });

    } catch (refundError) {
      console.error('Refund error:', refundError);
      return res.status(500).json({
        message: 'Failed to process refund',
        error: refundError.message || 'Unknown refund error'
      });
    }

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      message: 'Error cancelling order',
      error: error.message || 'Unknown error'
    });
  }
});

// Add tracking ID to order
// Update tracking ID route
// Add this import at the top of the file with other imports
const user = require('../models/users/user');

// Then update the tracking route to use lowercase 'user' model
router.post('/:orderId/tracking', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tracking_id } = req.body;

    if (!tracking_id || !tracking_id.trim()) {
      return res.status(400).json({ message: 'Tracking ID is required' });
    }

    const order = await Order.findByPk(orderId, {
      include: [{
        model: user,  // Use the imported lowercase 'user' model
        attributes: ['id', 'name', 'email', 'address', 'city', 'state', 'pincode']
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.user) { // Note: using lowercase 'user'
      return res.status(404).json({ 
        message: 'User information not found for this order',
        orderId,
        userId: order.user_id
      });
    }

    // Update order with tracking ID and change status to Shipped
    await order.update({ 
      tracking_id,
      status: 'Shipped'
    });

    // Send email to customer with tracking ID
    try {
      await sendTrackingUpdate(order.user, order); // Note: using lowercase 'user'
      
      return res.json({
        message: 'Tracking ID updated and notification sent',
        order: order.toJSON()
      });
    } catch (emailError) {
      console.error('Error sending tracking update email:', emailError);
      
      return res.json({
        message: 'Tracking ID updated but notification failed to send',
        order: order.toJSON(),
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('Error updating tracking ID:', error);
    return res.status(500).json({ 
      message: 'Error updating tracking ID',
      error: error.message 
    });
  }
});
// Add this route after your existing routes

// Get all orders (admin route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: user, // Changed from User to user to match the imported model
          attributes: ['name', 'email']
        },
        {
          model: OrderItem,
          include: [{
            model: Product,
            attributes: ['productname', 'images']
          }]
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
module.exports = router;