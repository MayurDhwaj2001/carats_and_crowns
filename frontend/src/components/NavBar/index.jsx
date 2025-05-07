import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../css/navbar.css";

function Index() {
  const [toggle, setToggle] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userName } = useContext(authContext);
  const cartLength = useSelector((state) => state.cart.length);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setShowDropdown(false);
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
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);



  return (
    <>
      <nav className="navbar">
        <NavLink className="brand" to="/">
          Carats & Crowns
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

            <li className="menu-item">
              <NavLink to="/cart" onClick={() => setToggle(false)}>
                <FontAwesomeIcon icon={faCartShopping} />
                <span className="p-1 rounded-full">{cartLength}</span>
              </NavLink>
            </li>

            <li className="menu-item">
              {token ? (
                <div className="relative">
                  <button 
                    onClick={toggleDropdown}
                    className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold focus:outline-none hover:bg-indigo-700"
                  >
                    {getInitials(userName)}
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <NavLink
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faGear} className="mr-2" />
                        Settings
                      </NavLink>
                      <button
                        onClick={signOutHandler}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setToggle(false)}
                  className="login-btn"
                >
                  Login
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
