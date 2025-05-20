import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import authContext from "../../store/store";
import { useContext } from "react";
import { useState } from "react";

// Move axios instance outside component
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const verifyOTP = async () => {
    try {
      const response = await api.post("/api/users/verify-otp", {
        email: userDetails.email,
        otp: otp.join('')  // Fix: use joined OTP array
      });

      if (response.data.success) {
        await api.post("/api/users/createuser", userDetails);
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.message === "Network Error") {
        alert("Unable to connect to server. Please check if the backend server is running.");
      } else {
        alert(error.response?.data?.message || "Invalid OTP. Please try again.");
      }
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

      const otpResponse = await api.post("/api/users/send-otp", {
        email: values.email,
        name: values.name
      });

      if (otpResponse.data.success) {
        setUserDetails(data);
        setShowOTP(true);
      } else {
        alert(otpResponse.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message === "Network Error") {
        alert("Unable to connect to server. Please check if the backend server is running on port 5000.");
      } else {
        alert(error.response?.data?.message || "An error occurred during signup");
      }
    }
  };

  const handleContainerPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length === 0) return;
    
    const newOtp = Array(6).fill('');
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });
    
    setOtp(newOtp);
    setOtpValue(newOtp.join(''));
    
    const lastFilledIndex = newOtp.reduce((acc, curr, i) => curr ? i : acc, 0);
    const inputToFocus = document.getElementById(`otp-${lastFilledIndex}`);
    if (inputToFocus) inputToFocus.focus();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpValue(newOtp.join(''));

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
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
            <NavLink to="/">
              <img 
                src="/images/Logo.png" 
                alt="Carats and Crowns" 
                className="h-16 mx-auto"
              />
            </NavLink>
            <h2 className="mt-6 text-center text-2xl font-semibold text-[#212121]">
              Verify Email
            </h2>
            <p className="text-center text-sm text-[#212121]">
              Enter the OTP sent to {userDetails?.email}
            </p>
            <div 
              className="flex justify-center space-x-4" 
              onPaste={handleContainerPaste}
              tabIndex="0"
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border-2 rounded-lg border-[#AC8F6F] focus:border-[#4D3C2A] focus:outline-none focus:ring-1 focus:ring-[#4D3C2A] text-[#212121]"
                  maxLength="1"
                />
              ))}
            </div>
            <button
              onClick={verifyOTP}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F3F3F3] bg-[#4D3C2A] hover:bg-[#AC8F6F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D3C2A]"
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
