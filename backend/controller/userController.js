const userService = require("../services/userServices");
const AllValidation = require("../validation/AllValidation");
const { model } = require("../models/index");

const fatchUser = async (req, res) => {
  try {
    const userdata = req.body;
    console.log(userdata)
    const { value, error } = AllValidation.fatchUser.validate(userdata);
    if (error) {  // Change from error !== undefined
      console.log("error", error);
      return res.status(400).json({ success: false, message: error.message });
    }
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
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
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = {
      name: req.body.name,
      pincode: req.body.pincode,
      locality: req.body.locality,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      landmark: req.body.landmark
    };

    const [updated] = await model.user.update(updates, {
      where: { id: userId }
    });

    if (updated) {
      const updatedUser = await model.user.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const deleteUser = async (req, res) => {};
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { 
  fatchUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  getAllUsers,
  getUserById
};
