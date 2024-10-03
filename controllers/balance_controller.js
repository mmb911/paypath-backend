import express from  "express";
import  User from "../models/user_model.js";

const balanceRouter = express.Router();

export const checkBalance = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.status(200).json({ message: Number(user.balance) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getTotalUserBalance = async (req, res) => {
  try {
    const totalBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    res.json(totalBalance[0].total);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//module.exports = balanceRouter;

//export default balanceRouter
