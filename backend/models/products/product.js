const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");
const product = Sequelize.define(
  "product",
  {
    ProductId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'productid' // Explicitly specify the database column name
    },
    ProductName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'productname'
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'description'
    },
    GoldCarat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'goldcarat'
    },
    Weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'weight'
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'price'
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'type'
    },
    Metal: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'metal'
    },
    Stones: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stones'
    },
    Images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: 'images'
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'createdby'
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'updatedby'
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true, // This will help with automatic column name conversion
    freezeTableName: true // Prevent Sequelize from pluralizing table name
  }
);

module.exports = product;
