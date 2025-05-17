const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");
const Product = require("../products/product");

const cart = Sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  },
  {
    timestamps: true,
    paranoid: false, // Remove paranoid mode to enable permanent deletion
    underscored: true,
    tableName: 'carts'
  }
);

cart.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = cart;
