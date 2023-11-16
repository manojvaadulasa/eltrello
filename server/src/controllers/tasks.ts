import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import task from "../models/task";
import { Server } from "socket.io";
import { SocketInterface as Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

export const getTasks = async (req:ExpressRequestInterface,res:Response,next:NextFunction) => {
    try {
        if(!req.user){
            return res.sendStatus(401);
        }
        const tasks = await task.find({ boardId: req.params.boardId });
        res.send(tasks)
    } catch (err) {
        next(err);
    }
}

export const createTasks = async (io:Server,socket:Socket,data : {boardId:string,title:string,columnId:string}) => {
    try {
        if(!socket.user){
            socket.emit(SocketEventsEnum.tasksFailure,"User is not authorized");        
            return;
        }
        const newTask = new task({
            title:data.title,
            boardId:data.boardId,
            userId:socket.user.id,
            columnId: data.columnId 
        });
        const saveTask = await newTask.save();
        io.to(data.boardId).emit(
            SocketEventsEnum.tasksSuccess,
            saveTask                          
        );
    } catch (error) {
        socket.emit(SocketEventsEnum.tasksFailure,getErrorMessage(error));        
    }
}

export const updateTasks = async (
    io : Server,
    socket:Socket,
    data:{  boardId : string,taskId:string,fields : { title?:string, description?:string, columnId?:string }  }
)=>{
    try {
        const updatedTasks = await task.findByIdAndUpdate(data.taskId,data.fields,{new : true});
        io.to(data.boardId).emit(SocketEventsEnum.tasksUpdateSuccess, updatedTasks);
    } catch (error) {
        socket.emit(SocketEventsEnum.tasksUpdateFailure, getErrorMessage(error));
    }
}

export const deleteTask = async (
    io: Server,
    socket: Socket,
    data: { boardId: string; taskId: string }
  ) => {
    try {
        if (!socket.user) {
            socket.emit(
                SocketEventsEnum.tasksDeleteFailure,
                "User is not authorized"
            );
            return;
        }
        await task.deleteOne({ _id: data.taskId });
        io.to(data.boardId).emit(SocketEventsEnum.tasksDeleteSuccess, data.taskId);
    } catch (err) {
        socket.emit(SocketEventsEnum.tasksDeleteFailure, getErrorMessage(err));
    }
  };