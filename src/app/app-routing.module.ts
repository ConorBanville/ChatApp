import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components 
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {path:"", component: LoginComponent},
  {path:"create-account", component: CreateAccountComponent},
  {path:"reset-password", component: ResetPasswordFormComponent},
  {path:"chat", component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
