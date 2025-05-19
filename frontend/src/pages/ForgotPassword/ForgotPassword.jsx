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
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  const CustomPopup = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#F3F3F3] p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-[#212121] text-center mb-4">{message}</div>
        <button
          onClick={onClose}
          className="w-full bg-[#4D3C2A] hover:bg-[#AC8F6F] text-[#F3F3F3] py-2 px-4 rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  const handleSendOTP = async (values, { setSubmitting }) => {
    if (isOtpSending || otpSent) {
      setSubmitting(false);
      return;
    }

    setIsOtpSending(true);
    setSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/users/send-otp", {
        email: values.email,
        name: "User"
      });

      if (response.data.success) {
        setEmail(values.email);
        setShowOTP(true);
        setOtpSent(true);
        setPopupMessage("OTP sent successfully!");
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage(error.response?.data?.message || "Failed to send OTP");
      setShowPopup(true);
      setOtpSent(false);
    } finally {
      setIsOtpSending(false);
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otpValue) {
        setPopupMessage("Please enter OTP");
        setShowPopup(true);
        return;
      }

      const response = await axios.post("http://localhost:5000/users/verify-otp", {
        email,
        otp: otpValue
      });

      if (response.data.success) {
        setShowOTP(false);
        setShowNewPassword(true);
        setPopupMessage("OTP verified successfully!");
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage(error.response?.data?.message || "Invalid OTP");
      setShowPopup(true);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/users/reset-password", {
        email: email,
        newPassword: values.newPassword,
      });

      if (response.data.success) {
        setPopupMessage("Password reset successful!");
        setShowPopup(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setPopupMessage(error.response?.data?.message || "Failed to reset password");
      setShowPopup(true);
    }
  };

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Add this function to handle container-level paste
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
    
    // Focus last filled input or first empty input
    const lastFilledIndex = newOtp.reduce((acc, curr, i) => curr ? i : acc, 0);
    const inputToFocus = document.getElementById(`otp-${lastFilledIndex}`);
    if (inputToFocus) inputToFocus.focus();
  };

  // Update the OTP input container and inputs
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

  const handleHiddenInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    const newOtp = value.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    setOtpValue(newOtp.join(''));
  };

  const handlePaste = (e, currentIndex) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && currentIndex + i < 6; i++) {
      newOtp[currentIndex + i] = pastedData[i];
    }
    setOtp(newOtp);
    setOtpValue(newOtp.join(''));

    // Focus the next empty input or the last filled one
    const nextIndex = Math.min(currentIndex + pastedData.length, 5);
    const nextInput = document.getElementById(`otp-${nextIndex}`);
    if (nextInput) nextInput.focus();
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

  // Update the OTP input section
  <div className="flex justify-center space-x-4">
    {otp.map((digit, index) => (
      <input
        key={index}
        id={`otp-${index}`}
        type="text"
        inputMode="numeric"
        value={digit}
        onChange={(e) => handleOtpChange(index, e.target.value)}
        onPaste={(e) => handlePaste(e, index)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        className="w-12 h-12 text-center text-xl border-2 rounded-lg border-[#AC8F6F] focus:border-[#4D3C2A] focus:outline-none focus:ring-1 focus:ring-[#4D3C2A] text-[#212121]"
        maxLength="1"
      />
    ))}
  </div>

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F0EA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#F3F3F3] p-8 rounded-xl shadow-lg">
        <div>
          <NavLink to="/">
            <img 
              src="/images/Logo.png" 
              alt="Carats and Crowns" 
              className="h-16 mx-auto"
            />
          </NavLink>
          <h2 className="mt-6 text-center text-2xl font-semibold text-[#212121]">
            Reset your password
          </h2>
        </div>

        {!showOTP && !showNewPassword ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSendOTP}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <Field
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    disabled={isOtpSending || otpSent}
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isOtpSending || otpSent}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F3F3F3] transition-colors duration-200 ${(isSubmitting || isOtpSending || otpSent) ? 'bg-[#AC8F6F] cursor-not-allowed' : 'bg-[#4D3C2A] hover:bg-[#AC8F6F]'}`}
                >
                  {isOtpSending ? 'Sending OTP...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
              </Form>
            )}
          </Formik>
        ) : showOTP ? (
          <div className="mt-8 space-y-6">
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border-2 rounded-lg border-[#AC8F6F] focus:border-[#4D3C2A] focus:outline-none focus:ring-1 focus:ring-[#4D3C2A] text-[#212121]"
                  maxLength="1"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOTP}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F3F3F3] bg-[#4D3C2A] hover:bg-[#AC8F6F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D3C2A]"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                />
                <ErrorMessage name="newPassword" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#AC8F6F] placeholder-[#AC8F6F] text-[#212121] focus:outline-none focus:ring-[#4D3C2A] focus:border-[#4D3C2A] focus:z-10 sm:text-sm"
                />
                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F3F3F3] bg-[#4D3C2A] hover:bg-[#AC8F6F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D3C2A]"
              >
                Reset Password
              </button>
            </Form>
          </Formik>
        )}

        <p className="mt-2 text-center text-sm text-[#212121]">
          Remember your password?{" "}
          <NavLink to="/login" className="font-medium text-[#4D3C2A] hover:text-[#AC8F6F]">
            Back to Login
          </NavLink>
        </p>

        {showPopup && (
          <CustomPopup
            message={popupMessage}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
