import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import authContext from "../../store/store";
import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../css/navbar.css";

function Index() {
  const [toggle, setToggle] = useState(false);
  const authCtx = useContext(authContext);
  const cartLength = useSelector((state) => state.cart.length);

  const signOutHandler = () => {
    localStorage.removeItem("token");
    authCtx.setToken(null);
    alert("Sign-out successful.");
  };

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    authCtx.setToken(token);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <>
      <nav className="navbar">
        <NavLink className="brand" to="/">
          {/* You can replace with actual logo image */}
          {/* <img src="./assets/LOGO.jpg" className="nav-logo" alt="Logo" /> */}
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
              {authCtx.token ? (
                <button onClick={signOutHandler} className="logout-btn">
                  Logout
                </button>
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
