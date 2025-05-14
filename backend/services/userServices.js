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
    console.log("Value:", user);

    if (!user) {
      return "NOT FOUND!";
    } else {
      const Pass = {
        userPass: value.password,
        dbPass: user.password,
      };
      const res = compareHash(Pass);
      if (res) {
        const RetriveUpdate = {
          id: user.id,
          email: user.email,
          role: user.role,  // Include role in token payload
        };
        const token = await createToken(RetriveUpdate);
        return { token, user: { name: user.name, role: user.role } };  // Return user data with role
      } else {
        return "Password wrong!";
      }
    }
  } catch (error) {
    console.log(error);
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

module.exports = { fatchUser, createUser, updateUser, deleteUser, findUserByEmail };
