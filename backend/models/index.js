const user = require("./users/user");
const cart = require("./carts/cart");
const category = require("./categories/categ");
const product = require("./products/product");
const Order = require("./orders/order");
const OrderItem = require("./orders/orderItem");
const Sequelize = require("../dbconnection/db");

// Existing associations
user.hasMany(cart, { onDelete: "CASCADE" });
cart.belongsTo(user, { onDelete: "CASCADE" });

category.hasMany(product, { onDelete: "CASCADE" });
product.belongsTo(category, { onDelete: "CASCADE" });

product.belongsToMany(cart, {
  onDelete: "CASCADE",
  through: "Product_cart",
  foreignKey: {
    name: "ProductID",
    allowNull: false,
    unique: true,
  },
});

cart.belongsToMany(product, {
  onDelete: "CASCADE",
  through: "Product_cart",
  foreignKey: {
    name: "ProductID",
    allowNull: false,
    unique: true,
  },
});

// Add Order associations
// Change these lines in the Order associations section
// From:
user.hasMany(Order, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
Order.belongsTo(user, {
  foreignKey: 'user_id'
});

// To:
user.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'User',  // Add this line
  onDelete: 'CASCADE'
});
Order.belongsTo(user, {
  foreignKey: 'user_id',
  as: 'User'  // Add this line
});

// Add OrderItem associations
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id'
});

product.hasMany(OrderItem, {
  foreignKey: 'product_id'
});
OrderItem.belongsTo(product, {
  foreignKey: 'product_id'
});

const model = Sequelize.models;

module.exports = { model, Sequelize };
