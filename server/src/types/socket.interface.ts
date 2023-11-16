import { Socket } from "socket.io";
import { UserDocument } from "./user.interface";

export interface SocketInterface extends Socket {
    user?:UserDocument
}