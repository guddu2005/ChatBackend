const express =require("express");
const userController = require("../controllers/user.controller")

const userRouter = express.Router();

userRouter.post("/signup",userController.signup);
userRouter.post("/login",userController.login);
userRouter.get("/logout",userController.logout);


module.exports={
    userRouter
}