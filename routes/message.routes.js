const express=require("express");
const messageController = require("../controllers/message.controller");

const messageRouter = express.Router();

messageRouter.post("/send/:receiverId",messageController.sendMessage);
messageRouter.get("/get/:userToChatId" , messageController.getMessage);

module.exports ={
    messageRouter
}