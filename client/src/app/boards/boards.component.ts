import { Component, OnInit } from "@angular/core";
import { BoardsService } from "../shared/services/boards.service";

@Component({
  selector:'app-boards',
  templateUrl:'./boards.component.html'
})
export class BoardsComponent implements OnInit{
  constructor(private boardsService:BoardsService){}
  ngOnInit() : void {
    this.boardsService.getBoards().subscribe({
      next: res => console.log(res)
    });
  }
}
