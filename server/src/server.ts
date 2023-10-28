import { createServer } from "http";
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as usersControllers from './controllers/users';
import * as boardControllers from './controllers/boards';
import auth from "./middlewares/auth";
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("toJSON",{
    virtuals:true,
    transform:(_,converted) => {
        delete converted._id;
    },
});

app.get("/",(req,res)=>{
    res.send("API is up");
});

app.post("/api/users",usersControllers.register);
app.post("/api/users/login",usersControllers.login);
app.get("/api/user",auth, usersControllers.currentUser);
app.get("/api/boards",auth,boardControllers.getBoards);

io.on("connection",()=>{
    console.log("connect");
});

mongoose.connect("mongodb://localhost:27017/eltrello").then(()=>{
    console.log("Connected to mongoDB");
    httpServer.listen(4001,()=>{
        console.log("API is listening on port 4001");
    })
});