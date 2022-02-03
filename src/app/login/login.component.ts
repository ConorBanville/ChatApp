import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoginData } from 'models/login-data.interface';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: AuthService, private router: Router){}

  formVariables = {
    name: "Sign In",
    message: "Use your email and password!",
    submitValue: "Sign In"
  }

  anchorVariables = {
    value1: "Forgot Password?",
    routerlink1:"/reset-password",
    value2: "Create Account?",
    routerlink2: "/create-account"
  }

  Submit(form:any) {
    this.SignUserIn({
       email: form.value.email, 
       password: form.value.password
      })
  }

  SignUserIn(user: LoginData) {
    this.auth.signUserInWithEmailAndPassword(user).then(() => {
      this.router.navigate(['chat']);
    })
  }
}