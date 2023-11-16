import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { CurrentUserInterface } from "../../types/currentUser.interface";
import { Router } from "@angular/router";
import { SocketService } from "src/app/shared/services/socket.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  error : string | null =null;
  form : any;

  constructor(
    private fb: FormBuilder,
    private authService :AuthService,
    private router : Router,
    private socketService : SocketService
  ) {}

  ngOnInit(): void {
      this.formInit();
  }

  formInit(){
    this.form = this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.authService.login(this.form.getRawValue()).subscribe({
      next : (currentUser:CurrentUserInterface) => {
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.formInit();
        this.error=null;
        this.router.navigateByUrl('/');
      },
      error : (err : HttpErrorResponse) => {
        console.log(err.error);
        this.error=err.error.emailOrPassword;
      }
    });

  }
}
