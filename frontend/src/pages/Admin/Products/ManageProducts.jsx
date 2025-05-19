import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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

function ManageProducts() {
  const { token } = useContext(authContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarat, setFilterCarat] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.jpg';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
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
        
        <h1 className="text-2xl font-bold text-[#212121] flex-grow">Manage Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="bg-[#4D3C2A] text-[#F3F3F3] px-4 py-2 rounded hover:bg-[#AC8F6F] transition-colors duration-200"
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
            className="flex-1 p-2 border border-[#AC8F6F] rounded bg-[#F3F3F3] text-[#212121]"
          />
          <select
            value={filterCarat}
            onChange={(e) => setFilterCarat(e.target.value)}
            className="p-2 border border-[#AC8F6F] rounded bg-[#F3F3F3] text-[#212121]"
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
        <div className="text-center py-4 text-[#212121]">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-4 bg-[#F3F3F3] rounded-lg shadow">
          <p className="text-[#212121]">No products found</p>
        </div>
      ) : (
        <div className="bg-[#F3F3F3] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-[#AC8F6F]">
            <thead className="bg-[#4D3C2A]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Carat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#F3F3F3] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F3F3F3] divide-y divide-[#AC8F6F]">
              {filteredProducts.map((product) => (
                <tr key={product.ProductId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                      {product.Images && product.Images[0] ? (
                        <img
                          src={getImageUrl(product.Images[0])}
                          alt={product.ProductName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#212121]">{product.ProductName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#212121]">{product.Type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#212121]">{product.GoldCarat}K</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#212121]">₹{product.Price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Link
                      to={`/admin/products/edit/${product.ProductId}`}
                      className="text-[#4D3C2A] hover:text-[#AC8F6F] transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.ProductId)}
                      className="text-[#4D3C2A] hover:text-[#AC8F6F] transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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

export default ManageProducts;