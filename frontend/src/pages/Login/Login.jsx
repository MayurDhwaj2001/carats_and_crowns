import { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import authContext from "../../store/store";

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',  // Update port to 5000
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

function Login() {
  const navigate = useNavigate();
  const { token, setToken, setUserName, setUserRole } = useContext(authContext);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("*Required"),
    password: Yup.string().required("*Required"),
    rememberMe: Yup.boolean()
  });

  const handleSubmit = async (values) => {
    try {
      const response = await api.post("/users/login", {  // Change from /users/fatchuser to /users/login
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        setAlertType('success');
        setAlertMessage('Login successful!');
        setShowAlert(true);
        
        if (values.rememberMe) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userName', response.data.user.name);
          localStorage.setItem('userRole', response.data.user.role);
          localStorage.setItem('userId', response.data.user.id);  // Add this line
        } else {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('userName', response.data.user.name);
          sessionStorage.setItem('userRole', response.data.user.role);
          sessionStorage.setItem('userId', response.data.user.id);  // Add this line
        }
        
        setToken(response.data.token);
        setUserName(response.data.user.name);
        setUserRole(response.data.user.role);
        
        setTimeout(() => {
          setShowAlert(false);
          if (response.data.user.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Login failed');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {showAlert && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${
            alertType === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`} role="alert">
            {alertMessage}
          </div>
        )}
        
        <div>
          <NavLink to="/">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Carats and Crowns
            </h1>
          </NavLink>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-700">
            Sign in to your account
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mt-8 space-y-6">
            <div>
              <Field
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                type="email"
                name="email"
                placeholder="Email Address"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <Field
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <NavLink to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </NavLink>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </Form>
        </Formik>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
