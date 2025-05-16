import React from 'react';
import { useContext } from 'react';
import authContext from '../../store/store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faBoxes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function AdminDashboard() {
  const { token, userName } = useContext(authContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg py-4 px-6 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 inline-flex items-center transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home Page
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="w-32"></div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUsers} className="text-indigo-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">• View user profiles</p>
              <p className="text-sm text-gray-500">• Manage roles</p>
              <p className="text-sm text-gray-500">• Track activity</p>
            </div>
          </div>

          <Link 
            to="/admin/products" 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faBoxes} className="text-indigo-500 text-2xl mr-3 group-hover:scale-110 transition-transform duration-200" />
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage jewelry products</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">• Add new products</p>
              <p className="text-sm text-gray-500">• Edit existing products</p>
              <p className="text-sm text-gray-500">• Manage inventory</p>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faShoppingCart} className="text-indigo-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
            </div>
            <p className="text-gray-600 mb-4">Track and manage customer orders</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">• View orders</p>
              <p className="text-sm text-gray-500">• Process payments</p>
              <p className="text-sm text-gray-500">• Manage shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;