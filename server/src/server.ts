import { createServer } from "http";
import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as usersControllers from './controllers/users';
import * as boardControllers from './controllers/boards';
import * as columnsControllers from './controllers/columns';
import * as tasksControllers from './controllers/tasks';
import auth from "./middlewares/auth";
import cors from 'cors';
import { SocketEventsEnum } from "./types/socketEvents.enum";
import { secret } from "./config";
import user from "./models/user";
import { SocketInterface } from "./types/socket.interface";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:'*'
    }
});

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
app.get("/api/boards/:boardId",auth,boardControllers.getBoard);
app.get("/api/boards/:boardId/columns",auth,columnsControllers.getColumns);
app.get("/api/boards/:boardId/tasks",auth,tasksControllers.getTasks);
app.post("/api/boards",auth,boardControllers.createBoard);

io.use(async (socket : SocketInterface,next)=>{
    try {
        const token : string = (socket.handshake.auth.token as string) ?? "";
        const data = jwt.verify(token.split(" ")[1],secret) as {
            id : string,
            email : string  
        }
        const users = await user.findById(data.id);
        if(!users){
            return new Error("Authentication error");
        }
        socket.user = users;
        next();
    } catch (error) {
        next(new Error("Authentication Error"));
    }
}).on("connection",(socket)=>{
    socket.on(SocketEventsEnum.boardsJoin,(data)=>{
        boardControllers.joinBoard(io,socket,data)
    });
    socket.on(SocketEventsEnum.boardsLeave,(data)=>{
        boardControllers.leaveBoard(io,socket,data)
    });
    socket.on(SocketEventsEnum.columnsCreate, (data)=>{
        columnsControllers.createColumns(io,socket,data) 
    });
    socket.on(SocketEventsEnum.tasksCreate, (data)=>{
        tasksControllers.createTasks(io,socket,data) 
    });
    socket.on(SocketEventsEnum.boardsCreate, (data)=>{
        boardControllers.updateBoards(io,socket,data) 
    });
    socket.on(SocketEventsEnum.boardsDelete, (data)=>{
        boardControllers.deleteBoards(io,socket,data) 
    });
    socket.on(SocketEventsEnum.columnDelete, (data)=>{
        columnsControllers.deleteColumn(io,socket,data) 
    });
    socket.on(SocketEventsEnum.columnsUpdate, (data)=>{
        columnsControllers.updateColumn(io,socket,data) 
    });
    socket.on(SocketEventsEnum.tasksUpdate, (data)=>{
        tasksControllers.updateTasks(io,socket,data) 
    });
    socket.on(SocketEventsEnum.tasksDelete, (data) => {
        tasksControllers.deleteTask(io, socket, data);
    }); 
});

mongoose.connect("mongodb://localhost:27017/eltrello").then(()=>{
    console.log("Connected to mongoDB");
    httpServer.listen(4001,()=>{
        console.log("API is listening on port 4001");
    })
});