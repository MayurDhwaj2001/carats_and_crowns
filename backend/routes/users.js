const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../services/auth/authMiddleware');
const { model } = require('../models/index');

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

const { createUser, fatchUser, getAllUsers, getUserById, updateUser } = require("../controller/userController");

/* GET users listing. */
router.post("/createuser", createUser);
// Remove this line
router.post("/fatchuser", fatchUser);
// And this line
router.post("/login", fatchUser);

// Keep only the detailed login implementation
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

// Get all users (protected route)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Only allow admin users to access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }

    const users = await model.user.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      where: { deletedAt: null }
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
});

// Add before module.exports = router;

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await model.user.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const info = await transporter.sendMail({
      from: `"Carats and Crowns" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${user.name},</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `
    });

    otpStore.set(email, {
      otp,
      expiry: Date.now() + 300000, // 5 minutes
      type: 'reset'
    });

    res.json({ success: true, message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process password reset request' 
    });
  }
});

// Add at the top with other imports
const { authHash, compareHash } = require('../services/auth/auth');

// Reset Password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await model.user.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Hash the new password using authHash
    const hashedPassword = await authHash({ password: newPassword });
    
    // Update the user's password
    await user.update({ password: hashedPassword });

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
router.get('/:id', authenticateToken, getUserById);
// Add this with your other routes
router.put('/:id', authenticateToken, updateUser);

module.exports = router;
