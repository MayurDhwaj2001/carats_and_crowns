const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");
const user = Sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {  // Add this field
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'  // Default role if not specified
    }
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = user;
