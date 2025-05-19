import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
// } from "firebase/auth";
import axios from "axios";

// import { auth } from "../../firebase/firebase-config";
import authContext from "../../store/store";
import { useContext } from "react";
import { useState, useEffect } from "react";

function SignUp() {
  const authCtx = useContext(authContext);
  const navigate = useNavigate();
  console.log(authCtx);

  const initialValues = {
    name: "",
    number: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAndConditions: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("*Required"),
    number: Yup.number().required("*Required"),
    email: Yup.string().email("Invalid email format").required("*Required"),
    password: Yup.string().required("*Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("*Required"),
    termsAndConditions: Yup.boolean().oneOf(
      [true],
      "Accept terms & conditions"
    ),
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  
  const verifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/verify-otp", {
        email: userDetails.email,
        otp: otpValue
      });

      if (response.data.success) {
        // Create user after OTP verification
        await axios.post("http://localhost:3000/users/createuser", userDetails);
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const onSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        number: values.number.toString(),
        email: values.email,
        password: values.password,
      };

      // First send OTP
      const otpResponse = await axios.post("http://localhost:3000/users/send-otp", {
        email: values.email,
        name: values.name // Adding name for email personalization
      });

      if (otpResponse.data.success) {
        setUserDetails(data);
        setShowOTP(true);
      } else {
        alert(otpResponse.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during signup";
      alert(errorMessage);
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F0EA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#F3F3F3] p-8 rounded-xl shadow-lg">
        {!showOTP ? (
          <>
            <div>
              <NavLink to="/">
                <img 
                  src="/images/Logo.png" 
                  alt="Carats and Crowns" 
                  className="h-16 mx-auto"
                />
              </NavLink>
              <h2 className="mt-6 text-center text-2xl font-semibold text-[#212121]">
                Create your account
              </h2>
            </div>
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form className="mt-8 space-y-4">
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
  
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="number"
                    name="number"
                    placeholder="Phone Number"
                  />
                  <ErrorMessage name="number" component="p" className="text-red-500 text-xs mt-1" />
                </div>
  
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>
  
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                </div>
  
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
                </div>
  
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        type="checkbox"
                        name="termsAndConditions"
                        className="h-4 w-4 text-[#4D3C2A] focus:ring-[#AC8F6F] border-[#AC8F6F] rounded accent-[#4D3C2A]"
                      />
                    </div>
                    <label className="ml-2 block text-sm text-[#212121]">
                      I accept the terms and conditions
                    </label>
                  </div>
                  <ErrorMessage 
                    name="termsAndConditions" 
                    component="p" 
                    className="text-red-500 text-xs pl-6" 
                  />
                </div>
  
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F3F3F3] bg-[#4D3C2A] hover:bg-[#AC8F6F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D3C2A]"
                >
                  Sign Up
                </button>
              </Form>
            </Formik>
  
            <p className="mt-2 text-center text-sm text-[#212121]">
              Already have an account?{" "}
              <NavLink to="/login" className="font-medium text-[#4D3C2A] hover:text-[#AC8F6F]">
                Login
              </NavLink>
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="mt-6 text-center text-2xl font-semibold text-[#212121]">
              Verify Email
            </h2>
            <p className="text-center text-sm text-[#212121]">
              Enter the OTP sent to {userDetails?.email}
            </p>
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
              onClick={verifyOTP}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
