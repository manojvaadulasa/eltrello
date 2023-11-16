import { NextFunction, Response } from "express";
import column from "../models/column";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { SocketInterface as Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

export const getColumns = async (req:ExpressRequestInterface,res:Response,next:NextFunction) => {
    try {
        if(!req.user){
            return res.sendStatus(401);
        }
        const columns = await column.find({ boardId: req.params.boardId });
        res.send(columns)
    } catch (err) {
        next(err);
    }
}

export const createColumns = async (io:Server,socket:Socket,data : {boardId:string,title:string}) => {
    try {
        if(!socket.user){
            socket.emit(SocketEventsEnum.columnsFailure,"User is not authorized");        
            return;
        }
        const newColumn = new column({
            title:data.title,
            boardId:data.boardId,
            userId:socket.user.id 
        });
        const saveColumn = await newColumn.save();
        io.to(data.boardId).emit(
            SocketEventsEnum.columnsSuccess,
            saveColumn                          
        );
    } catch (error) {
        socket.emit(SocketEventsEnum.columnsFailure,getErrorMessage(error));        
    }
}

export const deleteColumn = async (io : Server,socket:Socket,data:{boardId : string,columnId:string})=>{
    try {
        await column.deleteOne({_id:data.columnId});
        io.to(data.boardId).emit(SocketEventsEnum.columnDeleteSuccess, data.columnId);
    } catch (error) {
        socket.emit(SocketEventsEnum.columnDeleteFailure, getErrorMessage(error));
    }
}

export const updateColumn = async (io : Server,socket:Socket,data:{boardId : string,columnId:string,fields : {title:string}})=>{
    try {
        const updatedColumn = await column.findByIdAndUpdate(data.columnId,data.fields,{new : true});
        io.to(data.boardId).emit(SocketEventsEnum.columnsUpdateSuccess, updatedColumn);
    } catch (error) {
        socket.emit(SocketEventsEnum.columnsUpdateFailure, getErrorMessage(error));
    }
}