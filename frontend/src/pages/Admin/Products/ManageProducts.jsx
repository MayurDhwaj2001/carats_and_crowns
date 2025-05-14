import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarat, setFilterCarat] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productId}`);
        setProducts(products.filter(product => product.ProductId !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      filterCarat ? product.GoldCarat === parseInt(filterCarat) : true
    )
    .filter(product => 
      filterType ? product.Type.toLowerCase() === filterType.toLowerCase() : true
    );

  const uniqueCarats = [...new Set(products.map(product => product.GoldCarat))];
  const uniqueTypes = [...new Set(products.map(product => product.Type))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          to="/admin" 
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold flex-grow">Manage Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Product
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={filterCarat}
            onChange={(e) => setFilterCarat(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Carats</option>
            {uniqueCarats.map(carat => (
              <option key={carat} value={carat}>{carat}K</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.ProductId} className="bg-white rounded-lg shadow p-6">
              <img 
                src={product.Images[0]} 
                alt={product.ProductName}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.ProductName}</h2>
              <p className="text-gray-600 mb-2">{product.Description}</p>
              <div className="text-sm text-gray-500 mb-2">
                <p>Carat: {product.GoldCarat}K</p>
                <p>Type: {product.Type}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">${product.Price}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product.ProductId}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.ProductId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageProducts;