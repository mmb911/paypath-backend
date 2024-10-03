import express from "express";
import auth from '../middlewares/auth_middleware.js'
import admin from '../middlewares/admin_middleware.js'
import { fundWallet, getTransactions, transfer, getTotalNumberOfTransactions, getAllUserTransactions, getNumberOfWalletFundings, getNumberOfCreditTransactions, getNumberOfDebitTransactions } from "../controllers/transactions_controller.js";

const  transactionRouter = express.Router();


transactionRouter.post("/api/transactions/transfer", auth, transfer);

transactionRouter.get("/api/getTransactions/:username", auth, getTransactions);

transactionRouter.post("/api/fundWallet/:username", auth, fundWallet);

transactionRouter.get("/admin/getTotalNumberOfTransactions", admin, getTotalNumberOfTransactions);

transactionRouter.get("/admin/getAllUserTransactions", admin, getAllUserTransactions);

transactionRouter.get("/admin/getNumberOfWalletFundings", admin, getNumberOfWalletFundings);

transactionRouter.get("/admin/getNumberOfCreditTransactions", admin, getNumberOfCreditTransactions);

transactionRouter.get("/admin/getNumberOfDebitTransactions", admin, getNumberOfDebitTransactions);

//module.exports = transactionRouter;

export default transactionRouter
