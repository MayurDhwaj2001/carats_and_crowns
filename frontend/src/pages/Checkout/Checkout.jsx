import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import authContext from '../../store/store';
import axios from 'axios';
import { Clear_cart } from '../../store/redux/cart/CartActionType';

// Move AddressPopup component outside
const AddressPopup = ({ setShowAddressPopup, navigate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#F7F0EA] rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#AC8F6F] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#F3F3F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Complete Your Address</h2>
        <p className="text-[#212121] mb-6">Please add your delivery address details before proceeding to checkout.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setShowAddressPopup(false);
              navigate('/settings');
            }}
            className="bg-[#4D3C2A] text-[#F3F3F3] px-6 py-2 rounded-lg hover:bg-[#AC8F6F] transition-colors duration-200"
          >
            Add Address
          </button>
          <button
            onClick={() => setShowAddressPopup(false)}
            className="border-2 border-[#AC8F6F] text-[#4D3C2A] px-6 py-2 rounded-lg hover:bg-[#AC8F6F] hover:text-[#F3F3F3] transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Move AddressDisplay component outside of Checkout component
const AddressDisplay = ({ userAddress }) => {
  if (!userAddress) return null;

  return (
    <div className="bg-[#F7F0EA] rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Delivery Address</h2>
      <div className="space-y-3 text-[#212121]">
        <p className="text-lg">{userAddress.address}</p>
        <p>{userAddress.locality}</p>
        <p>{userAddress.city}, {userAddress.state}</p>
        <p>Pincode: {userAddress.pincode}</p>
        {userAddress.landmark && <p>Landmark: {userAddress.landmark}</p>}
      </div>
      <button
        onClick={() => navigate('/settings')}
        className="mt-6 text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors duration-200 flex items-center"
      >
       
      </button>
    </div>
  );
};

function Checkout() {
  const cart = useSelector((state) => state.items || []);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useContext(authContext);
  const [userAddress, setUserAddress] = useState(null);
  
  const clearCart = async () => {
    try {
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        // Fix the API endpoint to match backend route
        await axios.delete(`http://localhost:5000/api/cart/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Clear frontend cart state
        dispatch({ type: Clear_cart });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Update the useEffect hook to correctly access user data
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (token) {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Update this line to access the user object from the response
          setUserAddress(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user address:', error);
      }
    };
  
    fetchUserAddress();
  }, [token]);

  // Update the checkUserAddress function to correctly access user data
  const checkUserAddress = async () => {
    try {
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const user = response.data.user; // Update this line to access the user object
        const requiredFields = ['pincode', 'locality', 'address', 'city', 'state', 'landmark'];
        const missingFields = requiredFields.filter(field => !user[field]);

        if (missingFields.length > 0) {
          setShowAddressPopup(true);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking user address:', error);
      return false;
    }
  };

  const handleCheckout = async () => {
    try {
      const hasAddress = await checkUserAddress();
      if (!hasAddress) return;

      setLoading(true);
      setError(null);

      // Create order on your backend
      const response = await fetch('http://localhost:5000/api/razorpay/create-order', {
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Carats & Crowns",
        description: "Jewelry Purchase",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('http://localhost:5000/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token for authentication
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verificationResult = await verifyResponse.json();

            if (verifyResponse.ok && verificationResult.verified) {
              // Create order in your database
              const userId = JSON.parse(atob(token.split('.')[1])).id;
              await axios.post('http://localhost:5000/api/orders', {
                user_id: userId,
                items: cart.map(item => ({
                  id: item.id,
                  quantity: item.quantity,
                  price: item.price
                })),
                total_amount: total,
                payment_id: verificationResult.payment_id
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              await clearCart();
              navigate('/checkout/success');
            } else {
              throw new Error(verificationResult.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            setError(error.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled by user');
            setLoading(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com"
        },
        theme: {
          color: "#4D3C2A"
        },
        notes: {
          order_id: data.orderId
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
      <div className="container mx-auto px-4 py-8 mt-20 text-center"> {/* Added mt-20 */}
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
    <div className="min-h-screen bg-[#F7F0EA]">
      <div className="container mx-auto px-4 max-w-4xl pt-24"> {/* Changed pt-20 to pt-24 for more space */}
        <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8">Checkout</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <AddressDisplay userAddress={userAddress} />
          
          <div className="border-t border-[#AC8F6F] pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <img 
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded" 
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="ml-4">
                      <h3 className="text-[#212121] font-medium">{item.title}</h3>
                      <p className="text-[#AC8F6F]">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-[#4D3C2A] font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              
              <div className="border-t border-[#AC8F6F] pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-[#212121]">Total Amount</span>
                  <span className="text-[#4D3C2A]">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-6">
              {error}
            </div>
          )}
          
          <div className="mt-8">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#4D3C2A] text-white py-4 px-6 rounded-lg hover:bg-[#AC8F6F] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
              disabled={cart.length === 0 || loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Proceed to Payment (₹${total})`
              )}
            </button>
          </div>
        </div>
      </div>
      {showAddressPopup && <AddressPopup setShowAddressPopup={setShowAddressPopup} navigate={navigate} />}
    </div>
  );
}

export default Checkout;

// In your handlePaymentSuccess function
const handlePaymentSuccess = async (paymentId) => {
  try {
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    
    // Create order
    await axios.post('http://localhost:5000/api/orders', {
      user_id: userId,
      items: cart,
      total_amount: total,
      payment_id: paymentId
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Clear cart
    await clearCart();
    
    // Navigate to success page
    navigate('/success');
  } catch (error) {
    console.error('Error creating order:', error);
    setError('Failed to process order');
  }
};