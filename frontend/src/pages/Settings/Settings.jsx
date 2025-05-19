import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../../store/store';
import axios from 'axios';

function Settings() {
  const navigate = useNavigate();
  const { token, userName, setUserName } = useContext(authContext); // Add setUserName here
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: userName || '',
    phone: '',
    email: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUserDetails(prev => ({
            ...prev,
            name: userName || response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.number,
            // Add these lines to populate address fields
            pincode: response.data.user.pincode || '',
            locality: response.data.user.locality || '',
            address: response.data.user.address || '',
            city: response.data.user.city || '',
            state: response.data.user.state || '',
            landmark: response.data.user.landmark || ''
          }));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Authentication failed - please log in again');
          navigate('/login');
        } else {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [token, userName, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'phone') return; // Prevent editing email and phone
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const updatableFields = {
        name: userDetails.name,
        pincode: userDetails.pincode,
        locality: userDetails.locality,
        address: userDetails.address,
        city: userDetails.city,
        state: userDetails.state,
        landmark: userDetails.landmark
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updatableFields,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setIsEditing(false);
        setPopupType('success');
        setPopupMessage('Profile updated successfully!');
        setShowPopup(true);
        
        // Update global context and localStorage
        setUserName(userDetails.name);
        localStorage.setItem('userName', userDetails.name);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setPopupType('error');
      setPopupMessage('Failed to update profile. Please try again.');
      setShowPopup(true);
    }
  };

  // Add this before the return statement
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="min-h-screen bg-[#F7F0EA] py-12">
      {/* Add this at the top of your return statement */}
      {showPopup && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${popupType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {popupMessage}
        </div>
      )}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4D3C2A]">Account Settings</h1>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#4D3C2A] text-white rounded-lg hover:bg-[#AC8F6F] transition-colors"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Details'}
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-[#4D3C2A] border-b border-[#AC8F6F] pb-2">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] bg-gray-100 text-[#212121] cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#212121] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] bg-gray-100 text-[#212121] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-[#4D3C2A] border-b border-[#AC8F6F] pb-2">
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={userDetails.pincode}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={userDetails.locality}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#212121] mb-2">Address</label>
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={userDetails.city}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={userDetails.state}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#212121] mb-2">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={userDetails.landmark}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-[#AC8F6F] focus:ring-2 focus:ring-[#4D3C2A] focus:border-transparent bg-[#F7F0EA] text-[#212121]"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4D3C2A] text-white rounded-lg hover:bg-[#AC8F6F] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;