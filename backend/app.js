require('dotenv').config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var uploadRouter = require('./routes/upload');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
const stripeRoutes = require('./routes/stripe');
const razorpayRoutes = require('./routes/razorpay'); // Add this line

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Configure middleware
app.use(logger("dev"));

// Configure CORS - place this before other middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Configure other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configure routes
app.use("/", indexRouter);
// Change this line
app.use("/users", usersRouter);
// To this
app.use("/api/users", usersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/products', productsRouter);
// Add this with other route configurations
app.use('/api/cart', cartRouter);
app.use('/api', stripeRoutes);
app.use('/api/razorpay', razorpayRoutes); // Add this line

// Add orders route
const ordersRouter = require('./routes/orders');

// Add with other route configurations
app.use('/api/orders', ordersRouter);

// Replace the single model sync with this
// Replace the Promise.all block with sequential synchronization
const { model } = require('./models/index');

// Sync models in order of dependencies
async function syncModels() {
  try {
    // First, sync independent tables
    await model.user.sync({ alter: true });
    await model.category.sync({ alter: true });
    
    // Then sync tables that depend on users or categories
    await model.product.sync({ alter: true });
    await model.cart.sync({ alter: true });
    
    // Finally sync order-related tables
    await model.order.sync({ alter: true });
    await model.order_item.sync({ alter: true });
    
    console.log('All models synchronized successfully');
  } catch (err) {
    console.error('Error synchronizing models:', err);
  }
}

// Call the sync function
syncModels();
module.exports = app;
