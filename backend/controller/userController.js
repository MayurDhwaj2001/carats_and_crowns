const userService = require("../services/userServices");
const AllValidation = require("../validation/AllValidation");

const fatchUser = async (req, res) => {
  try {
    const userdata = req.body;
    console.log(userdata)
    const { value, error } = AllValidation.fatchUser.validate(userdata);
    if (error !== undefined) {
      console.log("error", error);
      res.status(400).json({ success: false, message: error.message });
    } else {
      const response = await userService.fatchUser(value);
      console.log("Response from Services:", response);
      if (response === "NOT FOUND!" || response === "Password wrong!") {
        res.status(401).json({ success: false, message: response });
      } else {
        res.json({
          success: true,
          token: response.token,
          user: response.user
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const createUser = async (req, res) => {
  try {
    const userdata = req.body;
    console.log("userData!", userdata);
    const { value, error } = AllValidation.createUser.validate(userdata)
    if (error !== undefined) {
      console.log("error", error);
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    // Check if email already exists
    const existingUser = await userService.findUserByEmail(value.email);
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already exists" });
      return;
    }

    const user = await userService.createUser(value);
    console.log("response from services:", user);
    if (!user) {
      res.status(401).json({ success: false, message: "Failed to create user" });
      return;
    }
    res.status(200).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: "Email already exists" });
      return;
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateUser = async (req, res) => {};
const deleteUser = async (req, res) => {};

module.exports = { fatchUser, createUser, updateUser, deleteUser };
