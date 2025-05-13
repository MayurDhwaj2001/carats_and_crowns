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
      <authContext.Provider value={{ 
        token, 
        setToken, 
        userName, 
        setUserName,
        userRole,
        setUserRole
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/*" element={<MyRoutes />} />
        </Routes>
      </authContext.Provider>
    </Provider>
  );
}

export default App;
