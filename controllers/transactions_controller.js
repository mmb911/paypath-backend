import  express from "express";
import mongoose from "mongoose";
import { v4 } from "uuid";
import Transactions from "../models/transaction_model.js";
import { creditAccount, debitAccount } from "../utils/transactions.js";
import User from "../models/user_model.js";

const transactionRouter = express.Router();


export const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Get the request body data
    const { recipientsUsername, sendersUsername, amount, description } =
      req.body;
    // Generate a reference number
    const reference = v4();
    if (!recipientsUsername || !sendersUsername || !amount || !description) {
      await session.endSession();
      return res.status(404).json({
        message: `Please provide the following details: ${recipientsUsername},${sendersUsername}, ${amount}, ${description}`,
      });
    }
    const transferResult = await Promise.all([
      debitAccount({
        amount,
        username: sendersUsername,
        purpose: "Transfer",
        reference,
        description,
        session,
        fullNameTransactionEntity: recipientsUsername,
      }),
      creditAccount({
        amount,
        username: recipientsUsername,
        purpose: "Transfer",
        reference,
        description,
        session,
        fullNameTransactionEntity: sendersUsername,
      }),
    ]);

    // Filter out any failed operations
    const failedTxns = transferResult.filter(
      (result) => result.statusCode !== 201
    );
    if (failedTxns.length) {
      const errors = failedTxns.map((a) => a.message);
      await session.abortTransaction();
      await session.endSession();
      return res.status(409).json({
        message: errors.join(" "),
      });
    }

    // If everything is successful, commit the transaction and end the session
    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
      message: "Transfer successful",
      transferResult,
    });
  } catch (err) {
    // If there is any error, abort the transaction, end the session and send an error response
    await session.abortTransaction();
    await session.endSession();

    return res.status(500).json({
      message: `Unable to perform transfer. Please try again. \n Error:${err}`,
    });
  }
}

export const getTransactions =  async (req, res) => {
    try {
      const { username } = req.params;
      const userTransactions = await Transactions.find({ username: username });
      if (userTransactions.length === 0) {
        return res.status(404).json({ message: "No transactions found" });
      }
      let showTransactionsFromRecentToLast = userTransactions.reverse();
      res.status(200).json(showTransactionsFromRecentToLast);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export const fundWallet = async (req, res) => {
  try {
    const { username } = req.params;
    /*please note if this will be used with the flutter app,
    only integers are allowed, no decimals allowed or an error will be thrown*/
    const { amount } = req.body;
    const reference = v4();
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ mesage: "User not found!!" });
    }
    if (amount > 5000) {
      return res
        .status(400)
        .json({ message: "The maximum amount that can be funded is 5000" });
    }
    await User.findOneAndUpdate(
      { username },
      { balance: user.balance + amount }
    );
    await Transactions.create({
      trnxType: "Wallet Funding",
      purpose: "Deposit",
      amount: amount,
      username: username,
      reference: reference,
      balanceBefore: Number(user.balance),
      balanceAfter: Number(user.balance) + Number(amount),
      description: "Wallet Funding",
      fullNameTransactionEntity: user.fullname,
    });
    res.status(200).json({ message: "Account funded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getTotalNumberOfTransactions =  async (req, res) => {
    try {
      const transactions = await Transactions.countDocuments({});
      res.status(200).json(transactions);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
}

export const getAllUserTransactions = async (req, res) => {
    try {
      res.header("Access-Control-Allow-Origin", "*"); // allow any origin
      const transactions = await Transactions.find({});
      let showTransactionsFromRecentToLast = transactions.reverse();
      res.status(200).json(showTransactionsFromRecentToLast);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
}

export const getNumberOfWalletFundings = async (req, res) => {
    try {
      res.header("Access-Control-Allow-Origin", "*"); // allow any origin
      const transactions = await Transactions.find({
        trnxType: "Wallet Funding",
      });
      res.status(200).json(transactions.length);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
}

export const getNumberOfCreditTransactions = async (req, res) => {
    try {
      res.header("Access-Control-Allow-Origin", "*"); // allow any origin
      const transactions = await Transactions.find({
        trnxType: "Credit",
      });
      res.status(200).json(transactions.length);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

export const getNumberOfDebitTransactions =  async (req, res) => {
    try {
      res.header("Access-Control-Allow-Origin", "*"); // allow any origin
      const transactions = await Transactions.find({
        trnxType: "Debit",
      });
      res.status(200).json(transactions.length);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
}


//module.exports = transactionRouter;

//export default transactionRouter