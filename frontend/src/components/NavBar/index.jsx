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
  const { token, setToken, userName, setUserName, userRole } = useContext(authContext);
  const cartLength = useSelector((state) => state.cart.length);

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
    setUserName(null);  // Clear the userName
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
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
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
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Index;
