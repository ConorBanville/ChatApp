import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// Componenets
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { EmailPasswordFormComponent } from './email-password-form/email-password-form.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import { CreateGroupFormComponent } from './create-group-form/create-group-form.component';

import * as firebase from 'firebase';
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailPasswordFormComponent,
    ChatComponent,
    CreateAccountComponent,
    ResetPasswordFormComponent,
    CreateGroupFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase, 'ChatApp')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
