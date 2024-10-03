import express from "express";
import auth from '../middlewares/auth_middleware.js'
import admin from '../middlewares/admin_middleware.js'
import { checkBalance, getTotalUserBalance } from "../controllers/balance_controller.js";

const balanceRouter = express.Router();

balanceRouter.get("/api/balance/:username", auth, checkBalance);

balanceRouter.get("/admin/getTotalUserBalance", admin, getTotalUserBalance);

//module.exports = balanceRouter;

export default balanceRouter
