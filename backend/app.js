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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Add this after your model definitions but before app.listen
const { model } = require('./models/index');
model.user.sync({ alter: true });
module.exports = app;
