import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import authContext from "./store/store";
import { useState } from "react";
import MyRoutes from "./routing/Routes";
import { Provider } from "react-redux";
import { ReduxStore } from "./store/redux/ReduxStore";

function App() {
  const [token, setToken] = useState(null);
  return (
    <Provider store={ReduxStore}>
      <authContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<MyRoutes />} />
        </Routes>
      </authContext.Provider>
    </Provider>
  );
}

export default App;
