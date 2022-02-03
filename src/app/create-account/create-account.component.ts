import { Component } from '@angular/core';
import { LoginData } from 'models/login-data.interface';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent{

  constructor(private auth: AuthService, private router: Router) { }

  formVariables = {
    name: "Create Account",
    message: "Use your email and password!",
    submitValue: "Create"
  }

  anchorVariables = {
    value1: "Go Back?",
    routerlink1:"",
    value2: "",
    routerlink2: ""
  }

  Submit(form: any) {
    this.CreateNewUser({
      email: form.value.email,
      password: form.value.password
    })
  }

  CreateNewUser(user: LoginData) {
    this.auth.registerUserWithEmailAndPassword(user).then(() => {
      setTimeout(() =>
      {
        this.router.navigate(['chat']);
      }, 500);
    });
  }
}