import { NextFunction, Response } from "express";
import board from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server, Socket } from "socket.io";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

export const getBoards = async (req:ExpressRequestInterface,res:Response,next:NextFunction) => {
    try {
        if(!req.user){
            return res.sendStatus(401);
        }
        const boards = await board.find({ userID: req.user._id });
        res.send(boards)
    } catch (err) {
        next(err);
    }
}

export const createBoard = async (req:ExpressRequestInterface,res:Response,next:NextFunction) => {
    try {
        if(!req.user){
            return res.sendStatus(401);
        }
        const newBoard = new board({
            title: req.body.title,
            userID: req.user._id
        });
        const savedBoard= await newBoard.save();
        res.send(savedBoard)
    } catch (err) {
        next(err);
    }
}

export const getBoard = async (req:ExpressRequestInterface,res:Response,next:NextFunction)=>{
    try {
        if(!req.user){
            res.sendStatus(401);
        }
        const reqBoard = await board.findById(req.params.boardId);
        res.send(reqBoard)
    } catch (error) {
        next(error)        
    }
}

export const joinBoard = (io : Server,socket:Socket,data:{boardId : string})=>{
    socket.join(data.boardId)
}

export const leaveBoard = (io : Server,socket:Socket,data:{boardId : string})=>{
    socket.leave(data.boardId)
}

export const updateBoards = async (io : Server,socket:Socket,data:{boardId : string,fields : {title:string}})=>{
    try {
        const updatedBoard = await board.findByIdAndUpdate(data.boardId,data.fields,{new : true});
        io.to(data.boardId).emit(SocketEventsEnum.boardsSuccess, updatedBoard);
    } catch (error) {
        socket.emit(SocketEventsEnum.boardsFailure, getErrorMessage(error));
    }
}

export const deleteBoards = async (io : Server,socket:Socket,data:{boardId : string})=>{
    try {
        await board.deleteOne({_id:data.boardId});
        io.to(data.boardId).emit(SocketEventsEnum.boardsDeleteSuccess);
    } catch (error) {
        socket.emit(SocketEventsEnum.boardsDeleteFailure, getErrorMessage(error));
    }
}