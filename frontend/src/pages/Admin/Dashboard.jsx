import React from 'react';
import { useContext } from 'react';
import authContext from '../../store/store';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faBoxes, faShoppingCart, faClipboardList } from '@fortawesome/free-solid-svg-icons';

function AdminDashboard() {
  const { token, userName } = useContext(authContext);

  return (
    <div className="min-h-screen bg-[#F7F0EA]">
      <nav className="bg-[#4D3C2A] shadow-lg py-4 px-6 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="bg-[#AC8F6F] text-[#F3F3F3] px-4 py-2 rounded-lg hover:bg-[#4D3C2A] inline-flex items-center transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home Page
          </Link>
          <h1 className="text-2xl font-bold text-[#F3F3F3]">Admin Dashboard</h1>
          <div className="w-32"></div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link 
            to="/admin/users"
            className="bg-[#F3F3F3] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUsers} className="text-[#4D3C2A] text-2xl mr-3 group-hover:scale-110 transition-transform duration-200" />
              <h2 className="text-xl font-semibold text-[#212121]">Users</h2>
            </div>
            <p className="text-[#212121] mb-4">Manage user accounts and permissions</p>
            <div className="mt-4 pt-4 border-t border-[#AC8F6F]">
              <p className="text-sm text-[#212121]">• View user profiles</p>
              <p className="text-sm text-[#212121]">• Manage roles</p>
              <p className="text-sm text-[#212121]">• Track activity</p>
            </div>
          </Link>

          <Link 
            to="/admin/products" 
            className="bg-[#F3F3F3] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faBoxes} className="text-[#4D3C2A] text-2xl mr-3 group-hover:scale-110 transition-transform duration-200" />
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
            </div>
            <p className="text-[#212121] mb-4">Manage jewelry products</p>
            <div className="mt-4 pt-4 border-t border-[#AC8F6F]">
              <p className="text-sm text-[#212121]">• Add new products</p>
              <p className="text-sm text-[#212121]">• Update inventory</p>
              <p className="text-sm text-[#212121]">• Manage categories</p>
            </div>
          </Link>

          <Link 
            to="/admin/orders" 
            className="bg-[#F3F3F3] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faClipboardList} className="text-[#4D3C2A] text-2xl mr-3 group-hover:scale-110 transition-transform duration-200" />
              <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
            </div>
            <p className="text-[#212121] mb-4">Manage customer orders</p>
            <div className="mt-4 pt-4 border-t border-[#AC8F6F]">
              <p className="text-sm text-[#212121]">• View all orders</p>
              <p className="text-sm text-[#212121]">• Update order status</p>
              <p className="text-sm text-[#212121]">• Process returns</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;