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
  // Fix the state selector to access the items array
  const cart = useSelector((state) => state.items || []);
  const dispatch = useDispatch();
  const { token } = useContext(authContext);

  // Update total price calculation to use the cart array
  const TotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
          const cartItems = response.data.map(item => ({
            id: item.product_id,
            cartId: item.id,
            quantity: item.quantity,
            price: item.price,
            title: item.product.productname,
            // Fix the image URL by prepending the backend URL
            image: `http://localhost:5000/${item.product.images[0]}`
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
      price: item.price
    }));
  };

  const DECQuantityHendeler = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      dispatch(Update({
        id: item.id,
        cartId: item.cartId,
        quantity: newQuantity,
        price: item.price
      }));
    }
  };

  const RemoveFromCartHendeler = (item) => {
    dispatch(Remove(item));
  };

  return (
    <div className="min-h-screen bg-[#F7F0EA] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8 text-[#212121]">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#4D3C2A] text-lg mb-4">Your cart is empty</p>
            <NavLink to="/products" className="bg-[#AC8F6F] text-[#F3F3F3] px-6 py-2 rounded-md hover:bg-[#4D3C2A] transition-colors">
              Continue Shopping
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'; // Fallback image
                      e.target.onerror = null; // Prevent infinite loop
                    }} 
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium text-[#212121]">{item.title}</h2>
                    <p className="text-[#4D3C2A] font-semibold">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => DECQuantityHendeler(item)}
                        className="text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors"
                      >
                        <FontAwesomeIcon icon={faSquareMinus} size="lg" />
                      </button>
                      <span className="text-[#212121] mx-2">{item.quantity}</span>
                      <button
                        onClick={() => INCQuantityHendeler(item)}
                        className="text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors"
                      >
                        <FontAwesomeIcon icon={faSquarePlus} size="lg" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => RemoveFromCartHendeler(item)}
                    className="text-[#AC8F6F] hover:text-[#4D3C2A] transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} size="lg" />
                  </button>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-[#212121]">Order Summary</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-[#212121]">Total</span>
                  <span className="text-[#4D3C2A] font-semibold">₹{TotalPrice}</span>
                </div>
                <NavLink
                  to="/checkout"
                  className="block w-full bg-[#AC8F6F] text-[#F3F3F3] text-center py-2 rounded-md hover:bg-[#4D3C2A] transition-colors"
                >
                  Proceed to Checkout
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
