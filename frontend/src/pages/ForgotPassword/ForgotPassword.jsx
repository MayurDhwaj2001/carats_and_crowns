import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");

  const initialValues = {
    email: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("*Required"),
    newPassword: showNewPassword ? Yup.string().required("*Required") : Yup.string(),
    confirmPassword: showNewPassword
      ? Yup.string()
          .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
          .required("*Required")
      : Yup.string(),
  });

  const handleSendOTP = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/users/forgot-password", {
        email: values.email,
      });

      if (response.data.success) {
        setEmail(values.email);
        setShowOTP(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/verify-otp", {
        email,
        otp: otpValue,
      });

      if (response.data.success) {
        setShowOTP(false);
        setShowNewPassword(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (values) => {
    try {
      console.log('Attempting password reset with:', { email, newPassword: values.newPassword });

      const response = await axios.post("http://localhost:3000/users/reset-password", {
        email: email,
        newPassword: values.newPassword,
      });

      console.log('Reset response:', response.data);

      if (response.data.success) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        alert(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error('Reset Error:', error);
      alert(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <NavLink to="/">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Carats and Crowns
            </h1>
          </NavLink>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-700">
            Reset your password
          </h2>
        </div>

        {!showOTP && !showNewPassword ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSendOTP}
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

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send OTP
              </button>
            </Form>
          </Formik>
        ) : showOTP ? (
          <div className="mt-8 space-y-6">
            <div>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter OTP"
                maxLength="6"
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </div>
        ) : (
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: ""
            }}
            validationSchema={Yup.object().shape({
              newPassword: Yup.string().required("*Required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("*Required")
            })}
            onSubmit={handleResetPassword}
          >
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage name="newPassword" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </Form>
          </Formik>
        )}

        <p className="mt-2 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <NavLink to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;