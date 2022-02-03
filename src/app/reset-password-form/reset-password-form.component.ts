import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent{

  constructor(private auth: AuthService, private router: Router) {}

  message = "Enter your email to recieve a link to reset your password!";

  Submit(formData:any)
  {
    this.auth.sendPasswordResetEmail(formData.value.email).then(() => {
      this.message = "Email link has been sent to " + formData.value.email + "!";
      setTimeout(() => {this.router.navigate([""])},4000);
    });
  }
}
