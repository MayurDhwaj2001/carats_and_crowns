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
    <div className="container mx-auto px-4 py-8 mt-20 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-purple-800">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <NavLink
            to="/products"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="w-20 h-20 overflow-hidden rounded">
                    <img
                      src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png'; // Add a placeholder image
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h2 className="text-lg font-semibold text-purple-800">{item.title}</h2>
                    <p className="text-purple-600 font-medium">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => DECQuantityHendeler(item)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <FontAwesomeIcon icon={faSquareMinus} size="lg" />
                    </button>
                    <span className="mx-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => INCQuantityHendeler(item)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <FontAwesomeIcon icon={faSquarePlus} size="lg" />
                    </button>
                    <button
                      onClick={() => RemoveFromCartHendeler(item)}
                      className="ml-6 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-4 text-purple-800">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-purple-600 font-bold">₹{TotalPrice}</span>
            </div>
            <NavLink
              to="/checkout"
              className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded hover:bg-purple-700 transition-colors"
            >
              Proceed to Checkout
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
