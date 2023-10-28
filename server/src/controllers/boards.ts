import { NextFunction, Response } from "express";
import board from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";

export const getBoards = async (req:ExpressRequestInterface,res:Response,next:NextFunction) => {
    try {
        if(!req.user){
            return res.sendStatus(401);
        }
        const boards = await board.find({ userID: req.user.id });
        res.send(boards)
    } catch (err) {
        next(err);
    }
}