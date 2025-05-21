import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authContext from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Create an axios instance with authentication
// Update the baseURL constant at the top of the file
const baseURL = 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const response = await api.get(`/api/orders/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F0EA] flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-[#4D3C2A]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F0EA] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F0EA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FontAwesomeIcon 
              icon={faShoppingBag} 
              className="text-[#AC8F6F] text-5xl mb-4" 
            />
            <h2 className="text-2xl font-semibold text-[#4D3C2A] mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link 
              to="/" 
              className="inline-block bg-[#4D3C2A] text-white px-6 py-2 rounded-lg hover:bg-[#AC8F6F] transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-[#AC8F6F]">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#4D3C2A]">
                      ₹{order.total_amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${order.status === 'completed' ? 'text-green-500' : 'text-[#AC8F6F]'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center mb-2">
                      <img
                        src={`${baseURL}${item.product.images[0]}`}
                        alt={item.product.productname}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="text-[#212121]">{item.product.productname}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.status === 'Processing Order' && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await api.post(`/api/orders/cancel/${order.id}`, {}, {
                          headers: { 'Authorization': `Bearer ${token}` } // Add the authorization header
                        });
                        if (response.status === 200) {
                          // Refresh orders list
                          fetchOrders();
                          setError(null); // Clear any previous errors
                        }
                      } catch (error) {
                        console.error('Error cancelling order:', error);
                        setError(error.response?.data?.message || 'Failed to cancel order');
                      }
                    }}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;