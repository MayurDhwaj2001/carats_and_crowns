const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");
const User = require("../users/user");

const Order = Sequelize.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Generate random alphanumeric string (2 letters + 4 numbers)
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                             letters.charAt(Math.floor(Math.random() * letters.length));
        const randomNumbers = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        
        return `ORD-${year}${month}${day}-${randomLetters}${randomNumbers}`;
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }
);

module.exports = Order;