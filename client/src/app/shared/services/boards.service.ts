import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BoardInterface } from "../types/board.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class BoardsService {
  constructor(private http:HttpClient){}
  getBoards():Observable<BoardInterface[]> {
    const url:string= environment.apiUrl + '/boards'
    return this.http.get<BoardInterface[]>(url);
  }
}
