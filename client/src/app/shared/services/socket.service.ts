import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { CurrentUserInterface } from "src/app/auth/types/currentUser.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class SocketService{
  socket : Socket | undefined;
  setupSocketConnection(curentUser:CurrentUserInterface):void{
    this.socket=io(environment.socketUrl,{
      auth : {
        token: curentUser.token
      }
    })
  }
  disconnect():void{
    if(!this.socket){
      throw new Error("Socket conneciton not established");
    }
    this.socket.disconnect();
  }
  emit(eventName:string,message:any):void{
    if(!this.socket){
      throw new Error("Socket conneciton not established");
    }
    this.socket.emit(eventName,message);
  }
  listen<T>(eventName: string): Observable<T> {
    const socket = this.socket;
    if (!socket) {
      throw new Error('Socket connection is not established');
    }

    return new Observable((subscriber) => {
      socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}
