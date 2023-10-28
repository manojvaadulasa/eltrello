import { Document, Schema } from "mongoose";

export interface Board {
    title:string,
    createdAt:Date,
    updatedAt:Date,
    userID:Schema.Types.ObjectId;
}

export interface BoardDocument extends Board,Document {}