module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    // ... existing fields ...
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    locality: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    landmark: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  });
  return User;
};