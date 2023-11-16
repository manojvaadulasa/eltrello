export enum SocketEventsEnum {
  boardsJoin = 'boards:join',
  boardsLeave = 'boards:leave',
  boardsCreate = "boards:update",
  boardsSuccess = "boards:updateSuccess",
  boardsFailure = "boards:updateFailure",
  boardsDelete = "boards:delete",
  boardsDeleteSuccess = "boards:deleteSuccess",
  boardsDeleteFailure = "boards:deleteFailure",
  columnDelete = "column:delete",
  columnDeleteSuccess = "column:deleteSuccess",
  columnDeleteFailure = "column:deleteFailure",
  columnsCreate = "columns:create",
  columnsSuccess = "columns:createSuccess",
  columnsFailure = "columns:createFailure",
  columnsUpdate = "columns:update",
  columnsUpdateSuccess = "columns:updateSuccess",
  columnsUpdateFailure = "columns:updateFailure",
  tasksCreate = "tasks:create",
  tasksSuccess = "tasks:createSuccess",
  tasksFailure = "tasks:createFailure",
}