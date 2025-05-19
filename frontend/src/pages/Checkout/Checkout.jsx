import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const cart = useSelector((state) => state.items || []);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order on your backend
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.title,
            quantity: item.quantity,
            price: item.price
          })),
          amount: total * 100 // Convert to smallest currency unit (paise)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key ID
        amount: data.amount,
        currency: "INR",
        name: "Carats & Crowns",
        description: "Jewelry Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              navigate('/checkout/success');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (err) {
            setError(err.message);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#7C3AED" // Purple color to match your theme
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message || 'An error occurred during checkout');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-800">Your cart is empty</h1>
        <button
          onClick={() => navigate('/products')}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-purple-800">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-purple-800">{item.title}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium text-purple-600">₹{item.price * item.quantity}</p>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-800">Total:</span>
            <span className="font-bold text-purple-600">₹{total}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition-colors disabled:bg-purple-400"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

export default Checkout;