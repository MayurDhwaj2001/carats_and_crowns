import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faGear, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../css/navbar.css";
import { Clear_cart, Replace_cart } from "../../store/redux/cart/CartActionType";
import axios from 'axios';

function Index() {
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userName, setUserName, userRole } = useContext(authContext);
  const cartLength = useSelector((state) => state.items?.length || 0);
  const dispatch = useDispatch();

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

  const signOutHandler = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    
    // Clear sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    
    // Clear context
    setToken(null);
    setUserName(null);
    setShowDropdown(false);

    // Clear cart
    dispatch({ type: Clear_cart });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
    
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [setToken, setUserName]);

  return (
    <>
      <nav className="navbar">
        <NavLink className="brand" to="/">
          <img src="/images/Logo.png" alt="Carats & Crowns Logo" className="h-10" />
        </NavLink>

        <input
          type="checkbox"
          id="nav"
          className="hidden"
          checked={toggle}
          onChange={toggleHandler}
        />
        <label htmlFor="nav" className="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <div className={`nav-wrapper ${toggle ? "open" : ""}`}>
          <ul className="menu">
            <li className="menu-item">
              <NavLink to="/" onClick={() => setToggle(false)}>
                Home
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/products" onClick={() => setToggle(false)}>
                Products
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/about" onClick={() => setToggle(false)}>
                About
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/contact" onClick={() => setToggle(false)}>
                Contact
              </NavLink>
            </li>
            {userRole === 'admin' && (
              <li className="menu-item">
                <NavLink to="/admin" onClick={() => setToggle(false)}>
                  <FontAwesomeIcon icon={faGear} className="mr-2" />
                  Admin Panel
                </NavLink>
              </li>
            )}
            <li className="menu-item">
              <NavLink to="/cart" onClick={() => setToggle(false)}>
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="p-1 rounded-full">{cartLength}</span>
              </NavLink>
            </li>
            
            {/* Add login/user profile button */}
            <li className="menu-item">
              {token ? (
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#4D3C2A] text-white flex items-center justify-center mr-2">
                      {getInitials(userName)}
                    </div>
                    <span className="hidden md:inline">{userName}</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={signOutHandler}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" onClick={() => setToggle(false)} className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span>Login</span>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Index;
