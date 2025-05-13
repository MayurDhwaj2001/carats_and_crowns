import React from 'react';
import { useContext } from 'react';
import authContext from '../../store/store';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
  const { token, userName } = useContext(authContext);

  // Basic admin dashboard layout
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample dashboard cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-600">Manage users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <p className="text-gray-600">Manage products</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          <p className="text-gray-600">Manage orders</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;