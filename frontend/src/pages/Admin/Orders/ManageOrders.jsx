import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F0EA] px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          to="/admin" 
          className="bg-[#AC8F6F] text-[#F3F3F3] px-4 py-2 rounded hover:bg-[#4D3C2A] flex items-center mr-4 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-[#212121] flex-grow">Manage Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-4 text-[#212121]">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-4 bg-[#F3F3F3] rounded-lg shadow">
          <p className="text-[#212121]">No orders found</p>
        </div>
      ) : (
        <div className="bg-[#F3F3F3] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-[#AC8F6F]">
            <thead className="bg-[#4D3C2A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F3F3F3] divide-y divide-[#AC8F6F]">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;