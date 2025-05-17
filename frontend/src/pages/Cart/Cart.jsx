import { useSelector, useDispatch } from "react-redux";
import { Remove, Update } from "../../store/redux/cart/CartAction";
import { useContext, useEffect } from "react";
import authContext from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faSquarePlus,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { Replace_cart } from "../../store/redux/cart/CartActionType";

function Cart() {
  const cart = useSelector((state) => state || []);
  const dispatch = useDispatch();
  const { token } = useContext(authContext);

  // Add this calculation before using TotalPrice
  const TotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
          const cartItems = response.data.map(item => ({
            id: item.product_id,
            cartId: item.id, // Add this line to store the cart item ID
            quantity: item.quantity,
            price: item.price,
            title: item.product.productname,
            image: item.product.images[0]
          }));
          dispatch({ type: Replace_cart, payload: cartItems });
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };
    fetchCart();
  }, [token, dispatch]);

  const INCQuantityHendeler = (item) => {
    const newQuantity = item.quantity + 1;
    dispatch(Update({
      id: item.id,
      cartId: item.cartId,
      quantity: newQuantity,
      price: item.price,
      title: item.title,
      image: item.image
    }));
  };

  const DECQuantityHendeler = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      dispatch(Update({
        id: item.id,
        cartId: item.cartId,
        quantity: newQuantity,
        price: item.price,
        title: item.title,
        image: item.image
      }));
    } else {
      dispatch(Remove({
        id: item.id,
        cartId: item.cartId
      }));
    }
  };

  // Update the cart item JSX
  return (
    <div className="bg-[#F7F0EA] mt-14 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4D3C2A] mb-8 text-center">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <NavLink to="/products" className="inline-block mt-4 text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors">
              Continue Shopping
            </NavLink>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center p-6 border-b border-gray-100 last:border-0">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                
                <div className="ml-6 flex-grow">
                  <h3 className="text-[#4D3C2A] font-medium">{item.title}</h3>
                  <p className="text-[#AC8F6F] mt-1">₹{item.price}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faSquareMinus}
                      className="text-2xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
                      onClick={() => DECQuantityHendeler(item)} // Pass the entire item
                    />
                    <input
                      type="number"
                      className="w-16 text-center font-medium border-2 border-[#AC8F6F] rounded-md py-1"
                      value={item.quantity}
                      disabled
                    />
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      className="text-2xl text-[#AC8F6F] cursor-pointer hover:text-[#4D3C2A] transition-colors"
                      onClick={() => INCQuantityHendeler(item)} // Pass the entire item
                    />
                  </div>
                  
                  <button
                    onClick={() => dispatch(Remove({
                      id: item.id,
                      cartId: item.cartId
                    }))}
                    className="text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors ml-4"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-6 bg-[#F7F0EA] mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-[#4D3C2A]">Total:</span>
                <span className="text-2xl font-bold text-[#4D3C2A]">₹{TotalPrice}</span>
              </div>
              
              <NavLink
                to="/checkout"
                className="mt-4 w-full bg-[#4D3C2A] text-white py-3 px-6 rounded-lg hover:bg-[#AC8F6F] transition-colors duration-300 font-semibold text-center block"
              >
                Proceed to Checkout
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
