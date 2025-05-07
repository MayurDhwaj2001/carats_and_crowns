const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Store OTPs temporarily
const otpStore = new Map();

// Email transporter
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email config error:", error);
  } else {
    console.log("Email server is ready");
  }
});

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const info = await transporter.sendMail({
      from: `"Carats and Crowns" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${name || 'User'},</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    });

    console.log("Email sent: %s", info.messageId);

    otpStore.set(email, {
      otp,
      expiry: Date.now() + 300000
    });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP: ' + error.message 
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'OTP expired or not found' });
  }

  if (storedData.expiry < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  otpStore.delete(email);
  res.json({ success: true, message: 'OTP verified successfully' });
});

const { createUser, fatchUser } = require("../controller/userController");

/* GET users listing. */
router.post("/createuser", createUser);
router.post("/fatchuser", fatchUser);

// Add these routes to your existing users.js

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: {
        name: 'Carats and Crowns',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 300000 // 5 minutes
    });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

const bcrypt = require('bcrypt');
const { model } = require("../models/index");
const { authHash, createToken, compareHash } = require("../services/auth/auth");

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Hash the password using the same method as registration
    const hashedPassword = await authHash({ password: newPassword });
    
    // Update user's password
    const result = await model.user.update(
      { password: hashedPassword },
      { where: { email } }
    );
    
    if (result[0] === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await model.user.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Compare passwords using compareHash instead of authCompare
    const isMatch = await compareHash({ 
      userPass: password, 
      dbPass: user.password 
    });
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate token and send response
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

module.exports = router;
