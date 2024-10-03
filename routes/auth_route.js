import express from "express";
// import auth from "../middlewares/auth_middleware";
import auth from '../middlewares/auth_middleware.js'
// import admin from "../middlewares/admin_middleware";
import admin from'../middlewares/admin_middleware.js'
import { createUser, sendPerpose, checkToken, createLoginPin, changePassword, getUsername, getUsernameFortransfer, loginUsingPin, changePin, loginAdmin, createAuthorizationPin, changeAdminAuthPin, verifyOtp, login, findUser } from"../controllers/auth_controller.js";

const authRouter = express.Router();


//POST
authRouter.post("/api/createUser", createUser);

authRouter.post("/api/sendOtp/:sendPurpose", sendPerpose);

authRouter.post("/api/verifyOtp", verifyOtp);

authRouter.post("/api/login", login);

authRouter.post("/checkToken", auth, checkToken);

authRouter.get("/", auth, findUser);

// This endpoint should only be used once the forgort password returns a 200 OK
authRouter.post("/api/changePassword/:email", changePassword);

authRouter.get("/api/getUsername/:username", auth, getUsername);

authRouter.get("/api/getUsernameFortransfer/:username", auth, getUsernameFortransfer);

authRouter.post("/api/createLoginPin/:username", createLoginPin);

authRouter.post("/api/loginUsingPin/:username", auth, loginUsingPin);

authRouter.post("/api/changePin/:username", auth, changePin);

authRouter.post("/admin/loginAdmin", loginAdmin);

authRouter.post("/admin/createAuthorizationPin", admin, createAuthorizationPin);

authRouter.post("/admin/changeAdminAuthPin", admin, changeAdminAuthPin);


//module.exports = authRouter;
 export default authRouter
