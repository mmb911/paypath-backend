import express from "express";
import admin from'../middlewares/admin_middleware.js'
import { getTotalNumberOfAllUsers, getAllUsers, getAllAdmin, createAdmin, deleteUser } from "../controllers/user_controller.js";

const userRouter = express.Router();


userRouter.get("/admin/getTotalNumberOfAllUsers", admin, getTotalNumberOfAllUsers);

userRouter.get("/admin/getAllUsers", admin, getAllUsers);

userRouter.get("/admin/getAllAdmin", admin, getAllAdmin);

userRouter.post("/admin/createAdmin", admin, createAdmin);

userRouter.delete("/admin/deleteUser", admin, deleteUser);

//module.exports = userRouter;
export default userRouter
