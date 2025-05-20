const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");
const Order = require("./order");
const Product = require("../products/product");

const OrderItem = Sequelize.define(
  "order_item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'productid' // Changed to match the database column name
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    timestamps: true
  }
);

module.exports = OrderItem;