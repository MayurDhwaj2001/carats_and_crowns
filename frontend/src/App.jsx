import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import authContext from "./store/store";
import { useState, useEffect } from "react";
import MyRoutes from "./routing/Routes";
import { Provider } from "react-redux";
import { ReduxStore } from "./store/redux/ReduxStore";
import AdminRoute from "./routing/AdminRoute";
import AdminDashboard from "./pages/Admin/Dashboard";
import ManageProducts from "./pages/Admin/Products/ManageProducts";
import ManageOrders from "./pages/Admin/Orders/ManageOrders";
import ManageUsers from "./pages/Admin/Users/ManageUsers";
import ProductForm from './pages/Admin/Products/ProductForm';
// Update these imports
import Checkout from './pages/Checkout/Checkout';
import CheckoutSuccess from './pages/Checkout/Success';
import CheckoutCancel from './pages/Checkout/Cancel';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName'));
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  return (
    <Provider store={ReduxStore}>
      <authContext.Provider value={{ token, setToken, userName, setUserName, userRole, setUserRole }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          } />
          <Route path="/admin/products/new" element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <AdminRoute>
              <ProductForm />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/*" element={<MyRoutes />} />
        </Routes>
      </authContext.Provider>
    </Provider>
  );
}

export default App;
