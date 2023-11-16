import { Schema, model } from "mongoose";
import { BoardDocument } from "../types/board.interface";

const boardSchema = new Schema<BoardDocument>({
    title: {
        type:String,
        required:true
    },
    userID: {
        type:Schema.Types.ObjectId,
        required:true
    },
},
{
    timestamps:true,
    collection: "boards",
})

export default model<BoardDocument>("boards", boardSchema);