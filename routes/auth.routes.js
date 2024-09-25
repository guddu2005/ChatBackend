const express=require("express");
const authController = require("../controllers/auth.controllers")

const authRouter=express.Router();

authRouter.get('/',authController.getUsersForSidebar);

module.exports={
    authRouter
}
