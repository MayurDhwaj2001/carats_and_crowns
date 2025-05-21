const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Changed from EMAIL_PASSWORD to EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send order confirmation email
const sendOrderConfirmation = async (user, order, items) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {  // Changed from EMAIL_PASSWORD to EMAIL_PASS
    throw new Error('Email configuration missing. Please check EMAIL_USER and EMAIL_PASS environment variables.');
  }

  // Create the email content with HTML formatting
  const emailContent = `
    <h1>Order Confirmation</h1>
    <p>Dear ${user.name},</p>
    <p>Thank you for your order! Here are your order details:</p>
    
    <h2>Order Information</h2>
    <p>Order Number: ${order.order_number}</p>
    <p>Order Date: ${new Date(order.order_date).toLocaleDateString()}</p>
    <p>Total Amount: ₹${order.total_amount.toFixed(2)}</p>
    
    <h2>Shipping Address</h2>
    <p>${user.address}</p>
    <p>${user.locality}</p>
    <p>${user.city}, ${user.state}</p>
    <p>PIN: ${user.pincode}</p>
    
    <h2>Order Items</h2>
    <table style="width:100%; border-collapse: collapse;">
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 10px; text-align: left;">Product</th>
        <th style="padding: 10px; text-align: right;">Quantity</th>
        <th style="padding: 10px; text-align: right;">Price</th>
      </tr>
      ${items.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product.productname}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
    
    <p style="margin-top: 20px;">If you have any questions about your order, please contact our customer service.</p>
    
    <p>Thank you for shopping with us!</p>
  `;

  // Send the email with proper error handling
  try {
    const info = await transporter.sendMail({
      from: `"Carats & Crowns" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmation - ${order.order_number}`,
      html: emailContent
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Add this new function for tracking updates
const sendTrackingUpdate = async (user, order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing. Please check EMAIL_USER and EMAIL_PASS environment variables.');
  }

  const emailContent = `
    <h1>Order Tracking Update</h1>
    <p>Dear ${user.name},</p>
    <p>Your order has been shipped! Here are your tracking details:</p>
    
    <h2>Order Information</h2>
    <p>Order Number: ${order.order_number}</p>
    <p>Tracking ID: ${order.tracking_id}</p>
    <p>Order Date: ${new Date(order.order_date).toLocaleDateString()}</p>
    
    <p>You can use this tracking ID to monitor your shipment's progress.</p>
    
    <p>Thank you for shopping with us!</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Carats & Crowns" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Shipping Update - Order ${order.order_number}`,
      html: emailContent
    });
    console.log('Tracking update email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send tracking update email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendTrackingUpdate
};