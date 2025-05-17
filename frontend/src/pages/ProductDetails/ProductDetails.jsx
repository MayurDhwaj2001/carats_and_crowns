import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faSquarePlus, faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Add } from "../../store/redux/cart/CartAction";
import { useContext } from "react";
import authContext from "../../store/store";

function ProductDetails() {
  // Add token to destructured values from authContext
  const { token } = useContext(authContext);
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const item = {
    id: data.ProductId,
    title: data.ProductName,
    price: data.Price,
    image: data.Images?.[0],
    quantity: quantity,
    total: data.Price * quantity,
  };

  const cartSelecter = useSelector((state) => state);

  const fetch = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/${id}`);
    setData(res.data);
    setSelectedImage(0);
  };

  const inc = () => {
    setQuantity(quantity + 1);
  };
  
  const dec = () => {
    if (quantity > 1) {  // Changed from 0 to 1 to maintain minimum quantity
      setQuantity(quantity - 1);
    }
  };

  const showNotification = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
  };

  const addToCartHandler = () => {
    if (!token) {
      showNotification("Please login to add items to cart");
      return;
    }
    
    dispatch(Add(item));
    showNotification("Item added to cart successfully");
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-[9999] animate-fade-in-down">
          <div className="bg-[#4D3C2A] rounded-lg shadow-xl p-4 flex items-center space-x-3">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-white text-xl"
            />
            <p className="text-white font-medium">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}

      {/* Existing product details JSX */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side - Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={data.Images?.[selectedImage]}
                  alt={data.ProductName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {data.Images?.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square overflow-hidden rounded-md cursor-pointer border-2 ${selectedImage === index ? 'border-[#AC8F6F]' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${data.ProductName} view ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
  
            {/* Right side - Product Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-[#4D3C2A] mb-4">{data.ProductName}</h1>
              <p className="text-gray-600 mb-6">{data.Description}</p>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#4D3C2A]">Product Details</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600">Type: {data.Type}</p>
                  <p className="text-gray-600">Gold Carat: {data.GoldCarat}</p>
                  <p className="text-gray-600">Weight: {data.Weight}g</p>
                  <p className="text-gray-600">Metal: {data.Metal}</p>
                  {data.Stones && <p className="text-gray-600">Stones: {data.Stones}</p>}
                </div>
              </div>
  
              <div className="text-3xl font-bold text-[#AC8F6F] mb-6">₹{data.Price}</div>
  
              <div className="mb-6">
                <label className="block text-lg font-semibold text-[#4D3C2A] mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon
                    icon={faSquareMinus}
                    className="text-2xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
                    onClick={dec}
                  />
                  <input
                    type="number"
                    className="w-16 text-center font-bold border-2 border-[#AC8F6F] rounded-md py-1"
                    disabled
                    value={quantity}
                  />
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    className="text-2xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
                    onClick={inc}
                  />
                </div>
              </div>
  
              <button
                className="w-full bg-[#4D3C2A] text-white py-3 px-6 rounded-lg hover:bg-[#AC8F6F] transition-colors duration-300 font-semibold"
                onClick={addToCartHandler}  // Fix the function name here
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
