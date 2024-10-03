import express from "express"
import User from "../models/user_model.js";
import bcryptjs from "bcryptjs"
import AdminAuthPin from "../models/admin_auth_pin_model.js";

const userRouter = express.Router();

export const getTotalNumberOfAllUsers = async (req, res) => {
  try {
    const totalNumberOfUsers = await User.countDocuments({});
    res.status(200).json(totalNumberOfUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export const getAllAdmin = async (req, res) => {
  try {
    const allAdmins = await User.find({ type: "admin" || "agent" });
    res.status(200).json(allAdmins);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export const createAdmin =  async (req, res) => {
  try {
    const { fullname, username, email, password, type } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        message: "Admin or User already exists",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      fullname: fullname,
      username: username,
      email: email,
      password: hashedPassword,
      type: type,
    });
    user = await user.save();

    return res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: `Unable to create admin. Please try again.\n Error:${e}`,
    });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { authorizationPin, username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User or Admin not found" });
    }
    const adminAuthPin = await AdminAuthPin.findOne({ pin: authorizationPin });
    const isMatch = bcryptjs.compare(authorizationPin, adminAuthPin.pin);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect Admin Authorization Pin" });
    }
    await User.findOneAndDelete({ username });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

//module.exports = userRouter;
