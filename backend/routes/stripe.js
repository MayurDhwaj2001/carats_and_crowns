const express = require('express');
const router = express.Router();
const stripe = require('stripe')('your_secret_key'); // Replace with your Stripe secret key

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5173/checkout/success',
      cancel_url: 'http://localhost:5173/checkout/cancel',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;