import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { CurrentUserInterface } from "../../types/currentUser.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector:'app-register',
  templateUrl:'./register.component.html'
})
export class RegisterComponent implements OnInit {
  error : string | null =null;
  form : any;

  constructor(
    private fb: FormBuilder,
    private authService :AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
      this.formInit();
  }

  formInit(){
    this.form = this.fb.nonNullable.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.authService.register(this.form.getRawValue()).subscribe({
      next : (currentUser : CurrentUserInterface) => {
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.formInit();
        this.error=null;
        this.router.navigateByUrl('/');
      },
      error : (err : HttpErrorResponse) => {
        console.log(err.error);
        this.error=err.error.join(', ');
      }
    });

  }
}
