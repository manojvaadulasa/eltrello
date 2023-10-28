import { Injectable } from "@angular/core";
import { CurrentUserInterface } from "../types/currentUser.interface";
import { BehaviorSubject, Observable, filter, map } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { RegisterRequestInterface } from "../types/registerRequest.interface";
import { LoginRequestInterface } from "../types/loginRequest.interface";

@Injectable()
export class AuthService{
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined);
  isLoggedIn$ = this.currentUser$.pipe(
    filter(res=> res !== undefined), // This will stop the stream if the initial state is undefined as Boolean(res) within the map will throw null as the result if undefined is given to it
    map(res => Boolean(res)) // Boolean(res) will give false if res is null and true if it gives CurrentUserinterface
  );

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user';
    return this.http.get<CurrentUserInterface>(url);
  }

  register(registerRequest:RegisterRequestInterface):Observable<CurrentUserInterface>{
    const url:string= environment.apiUrl + '/users';
    return this.http.post<CurrentUserInterface>(url,registerRequest);
  }

  login(loginRequest:LoginRequestInterface):Observable<CurrentUserInterface>{
    const url:string= environment.apiUrl + '/users/login';
    return this.http.post<CurrentUserInterface>(url,loginRequest);
  }

  setToken(currentUser: CurrentUserInterface):void {
    localStorage.setItem('token',currentUser.token);
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }
}
