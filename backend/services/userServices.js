const { where } = require("sequelize");
const { model, Sequelize } = require("../models/index");
const { authHash, createToken, compareHash } = require("./auth/auth");

const fatchUser = async (value) => {
  try {
    const user = await model.user.findOne({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      return "NOT FOUND!";
    } else {
      const Pass = {
        userPass: value.password,
        dbPass: user.password,
      };
      // Add await here to properly handle the async password comparison
      const res = await compareHash(Pass);
      if (res) {
        const RetriveUpdate = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        const token = await createToken(RetriveUpdate);
        return { 
          token, 
          user: { 
            id: user.id,
            name: user.name, 
            role: user.role 
          } 
        };
      } else {
        return "Password wrong!";
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const createUser = async (data) => {
  try {
    console.log("Value");
    const EncyPass = await authHash(data);
    const userData = { ...data, password: EncyPass };
    console.log(`UserData:`, userData);
    const FinalData = await model.user.create(userData);
    console.log(`response form databae:`, FinalData);
    return FinalData;
  } catch (error) {
    console.log(error);
  }
};
const updateUser = async () => {};
const deleteUser = async () => {};
const findUserByEmail = async (email) => {
  try {
    const user = await model.user.findOne({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [['createdAt', 'DESC']]
    });
    return users;
  } catch (error) {
    console.error('Error in getAllUsers service:', error);
    throw error;
  }
};
const getUserById = async (userId) => {
  try {
    const user = await model.user.findByPk(userId, {
      attributes: { exclude: ['password'] } // Don't send password
    });
    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};

module.exports = { fatchUser, createUser, updateUser, deleteUser, findUserByEmail, getAllUsers, getUserById };
