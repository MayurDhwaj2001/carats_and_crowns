import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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

function ProductForm() {
  const { token } = useContext(authContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  // In the fetchProduct function
  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const productData = response.data;
      setFormData({
        ProductName: productData.ProductName || '',
        Description: productData.Description || '',
        GoldCarat: productData.GoldCarat || '',
        Weight: productData.Weight || '',
        Price: productData.Price || '',
        Type: productData.Type || '',
        Metal: productData.Metal || '',
        Stones: productData.Stones || ''
      });
      // Fix image URLs when fetching
      const imageUrls = productData.Images?.map(url => 
        url.startsWith('http') ? url : `http://localhost:5000${url}`
      ) || [];
      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product details');
    }
  };
  
  // In the handleImageUpload function
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
  
    setUploading(true);
  
    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.urls) {
        // Make sure to use the complete URLs from the backend
        const newImages = response.data.urls.map(url => 
          url.startsWith('http') ? url : `http://localhost:5000${url}`
        );
        setImages([...images, ...newImages]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Strip the base URL from images before sending to backend
      const strippedImages = images.map(url => 
        url.replace('http://localhost:5000', '')
      );

      if (images.length === 0) {
        alert('Please upload at least one image');
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        Images: strippedImages,
        CreatedBy: 1 // Replace with actual user ID from context
      };

      if (id) {
        await api.put(`/api/products/${id}`, {
          ...productData,
          UpdatedBy: 1 // Replace with actual user ID from context
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await api.post('/api/products', productData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      // Display more specific error message
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert(error.response?.data?.message || 'Failed to save product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add image preview section in the return statement
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
            <label className="block mb-2">Price (₹)</label>
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
              disabled={uploading || images.length >= 6}
            />
            {uploading && <p className="text-gray-500 mt-2">Uploading images...</p>}
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
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
            disabled={loading || uploading}
            className="bg-[#4D3C2A] text-white px-6 py-2 rounded hover:bg-[#AC8F6F] transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;