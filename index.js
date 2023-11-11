const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const userRoutes = require('./routers/userRouter')
const msgRoutes = require('./routers/msgRouter')

const app = express();
app.use(express.json());
require('dotenv').config();
port = process.env.PORT;
app.use(cors());
app.use("/api/auth" , userRoutes)
app.use("/api/messages" , msgRoutes)




mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', ()=>{
    console.log("MongoDB is Connected");
})
mongoose.connection.on('disconnected', ()=>{
    console.log("MongoDB is not Connected");
})

const server = app.listen(port, ()=>{
    console.log(`Server Started at Port ${port}`);
})

const io = socket(server,{
    cors:{
        origin: "http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user" , (userId)=>{
        onlineUsers.set(userId,socket.id)
    })
    socket.on("send-msg" , (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive" , data.message);
        }
    })
})

