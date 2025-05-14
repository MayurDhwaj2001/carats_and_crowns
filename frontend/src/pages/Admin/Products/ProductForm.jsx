import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Create an axios instance with authentication
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add this import at the top with other imports
import authContext from '../../../store/store';
import { useContext } from 'react';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);  // New state for upload animation
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    ProductName: '',
    Description: '',
    GoldCarat: '',
    Weight: '',
    Price: '',
    Type: '',
    Metal: '',
    Stones: ''
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setFormData(response.data);
      setImages(response.data.Images);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // At the top of your file, after the imports
  axios.defaults.baseURL = 'http://localhost:5000';
  
  // Update the handleImageUpload function
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      alert('Maximum 6 images allowed');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    setUploading(true);  // Start upload animation

    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.urls) {
        const newImages = response.data.urls.map(url => `http://localhost:5000${url}`);
        setImages([...images, ...newImages]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Upload error details:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);  // Stop upload animation
      e.target.value = '';
    }
  };

  // Add this JSX where you want to show the upload button and preview
  const renderImageUpload = () => (
    <div className="col-span-2">
      <label className="block mb-2">Product Images (Max 6)</label>
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => setImages(images.filter((_, i) => i !== index))}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
          disabled={uploading || images.length >= 6}
        />
        {uploading && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading images...</p>}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Try sessionStorage first, then localStorage
      const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }
  
      const productData = {
        ...formData,
        Images: images,
        CreatedBy: parseInt(userId)
      };
  
      if (id) {
        await api.put(`/api/products/${id}`, productData);
      } else {
        await api.post('/api/products', productData);
      }
  
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.message === 'User not authenticated') {
        alert('Please log in again to continue.');
        navigate('/login');
      } else {
        alert('Failed to save product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block mb-2">Product Name</label>
            <input
              type="text"
              name="ProductName"
              value={formData.ProductName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Gold Carat</label>
            <input
              type="number"
              name="GoldCarat"
              value={formData.GoldCarat}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Weight (g)</label>
            <input
              type="number"
              step="0.01"
              name="Weight"
              value={formData.Weight}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="Price"
              value={formData.Price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Type</label>
            <input
              type="text"
              name="Type"
              value={formData.Type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Metal</label>
            <input
              type="text"
              name="Metal"
              value={formData.Metal}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Stones</label>
            <input
              type="text"
              name="Stones"
              value={formData.Stones}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2">
              Images ({images.length}/6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              disabled={images.length >= 6}
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;