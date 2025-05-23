import React from "react";
import { Routes, Route } from "react-router-dom";
import HOME from "../pages/Home/index.jsx";
import Products from "../pages/Products/index.jsx";
import ProductDetails from "../pages/ProductDetails/ProductDetails.jsx";
import Login from "../pages/Login/Login.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import NavBar from "../components/NavBar/index.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";
import About from "../pages/About/About.jsx";
import ContactUs from "../pages/ContactUs/ContactUs.jsx";
import ErrorPage from "../pages/ErrPage/ErrorPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import CheckoutSuccess from "../pages/Checkout/Success.jsx";
import CheckoutCancel from "../pages/Checkout/Cancel.jsx";
import Fproduct from "../components/Fproduct/Fproduct.jsx";
import Settings from '../pages/Settings/Settings';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageProducts from '../pages/Admin/Products/ManageProducts';
import ManageOrders from '../pages/Admin/Orders/ManageOrders';
import ManageUsers from '../pages/Admin/Users/ManageUsers';
import ProductForm from '../pages/Admin/Products/ProductForm';
import Orders from "../pages/Orders/Orders.jsx";
import CookiePolicy from "../pages/CookiePolicy/CookiePolicy";
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import Terms from '../pages/Terms/Terms';

function MyRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<HOME />} />
          <Route path="checkout">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Checkout/>
                </ProtectedRoute>
              }
            />
            <Route path="success" element={<CheckoutSuccess />} />
            <Route path="cancel" element={<CheckoutCancel />} />
          </Route>
          <Route path="cart" element={<Cart />} />
          <Route path="product/:id" element={<ProductDetails />}>
            <Route index element={<Fproduct />} />
          </Route>
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="cookie-policy" element={<CookiePolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><ProductForm /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default MyRoutes;
