const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { mongoose } = require("mongoose");


//file require:
const { app , server } = require("./socket/socket")
const {userRouter}= require("./routes/user.routes");
const { messageRouter } =require("./routes/message.routes");
const {authRouter}=require("./routes/auth.routes");
const {restrictToLoggedUserOnly,checkAuth} = require("./middleware/auth")


const PORT=process.env.PORT || 5000;

dotenv.config();
//middleware;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//routes;
// app.use("/api/auth",restrictToLoggedUserOnly,authRouter);
app.use("/api/user",userRouter);
app.use("/api/chat/" ,restrictToLoggedUserOnly ,messageRouter);

//mongodb Connection
const connectToMongoDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error in connecting mongoDB",err);
    }
}

server.listen(PORT ,()=>{
    connectToMongoDb();
    console.log(`Server is running on the port ${PORT}`);
})

