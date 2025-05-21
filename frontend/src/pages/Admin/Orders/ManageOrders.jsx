import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTruck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import authContext from '../../../store/store';

// Create an axios instance with authentication
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

function ManageOrders() {
  const { token } = useContext(authContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update the fetchOrders function
  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateTrackingId = async (orderId) => {
    try {
      if (!trackingId.trim()) {
        throw new Error('Tracking ID cannot be empty');
      }
      
      await api.post(`/api/orders/${orderId}/tracking`, 
        { tracking_id: trackingId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setTrackingId('');
      setSelectedOrder(null);
      await fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error updating tracking ID:', error);
      alert('Failed to update tracking ID: ' + (error.response?.data?.message || error.message));
    }
  };

  // Update the getOrdersByStatus function
  const getOrdersByStatus = (status) => {
    if (Array.isArray(status)) {
      return orders.filter(order => status.includes(order.status));
    }
    return orders.filter(order => order.status === status);
  };
  
  // In the return statement, update the Processing Orders section
  const renderOrderSection = (title, status) => {
    const filteredOrders = getOrdersByStatus(status);
    const isProcessingSection = Array.isArray(status) && status.includes('Processing Order');
  
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#4D3C2A]">{title} ({filteredOrders.length})</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-[#4D3C2A] text-white">
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2">Order Number</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  {isProcessingSection && <th className="px-4 py-2">Tracking</th>}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="border-b hover:bg-[#F7F0EA]">
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={expandedOrder === order.id ? faChevronUp : faChevronDown} />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">{order.order_number}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(order.order_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-2 text-center">{order.user?.name || ''}</td>
                      <td className="px-4 py-2 text-center">{order.user?.email || ''}</td>
                      <td className="px-4 py-2 text-center">₹{order.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'Processing Order' ? 'bg-blue-100 text-blue-800' : order.status === 'Shipped' ? 'bg-green-100 text-green-800' : order.status === 'Cancelling' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      {isProcessingSection && (
                        <td className="px-4 py-2 text-center">
                          {selectedOrder === order.id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                placeholder={order.tracking_id || "Enter tracking ID"}
                                className="border rounded px-2 py-1 w-40"
                              />
                              <button
                                onClick={() => updateTrackingId(order.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrder(null);
                                  setTrackingId('');
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-gray-600 mr-2">{order.tracking_id || 'No tracking ID'}</span>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order.id);
                                  setTrackingId(order.tracking_id || '');
                                }}
                                className="flex items-center justify-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                <FontAwesomeIcon icon={faTruck} />
                                <span>Edit</span>
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={isProcessingSection ? 8 : 7}>
                          {renderOrderItems(order.order_items)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No orders found</p>
          )}
        </div>
      </div>
    );
  };

  const renderOrderItems = (items) => (
    <div className="p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Order Items:</h3>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">Product</th>
            <th className="px-2 py-1 text-right">Quantity</th>
            <th className="px-2 py-1 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-2 py-1">{item.product.productname}</td>
              <td className="px-2 py-1 text-right">{item.quantity}</td>
              <td className="px-2 py-1 text-right">₹{item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // In the return statement of the component, update the Processing Orders section call
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/admin" className="text-[#4D3C2A] hover:text-[#2A1810] mr-4">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1 className="text-3xl font-bold text-[#4D3C2A]">Manage Orders</h1>
      </div>
    
      {loading ? (
        <p className="text-center py-4">Loading orders...</p>
      ) : (
        <>
          {renderOrderSection('Processing & Shipped Orders', ['Processing Order', 'Shipped'])}
          {renderOrderSection('Cancelling Orders', 'Cancelling')}
          {renderOrderSection('Cancelled Orders', 'Cancelled')}
        </>
      )}
    </div>
  );
}

export default ManageOrders;