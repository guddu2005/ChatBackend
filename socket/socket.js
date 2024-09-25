const { Server } = require("socket.io");
const http = require("http");

const express= require("express");

const app=express();
const server = http.createServer(app);
const io=new Server (server ,{
    cors: {
		credentials:true,
		methods: ["GET", "POST"],
	},
});

const getReceiverSocketId= (receiverId)=>{
    return userSocketMap[receiverId];
}

//userSocketMap :- keeps the track of user connected
const userSocketMap={};  //{suerID:socketId}

io.on("connection", (socket)=>{
    console.log("a user connectd", socket.id);
    const userId=socket.handshake.query.userId; // Extract userId from the connection query
    if(userId != "undefined") userSocketMap[userId]=socket.id;

    //io.emit() is used to send the events to all the connected clients
    io.emit("getOnlineUsers" ,Object.keys(userSocketMap));

    //socket.on() is used to listen the evenets can be used both on client and server  side
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

});

module.exports ={
    app, server , io , getReceiverSocketId
}

