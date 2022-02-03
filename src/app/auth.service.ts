import { Injectable } from '@angular/core';
import { LoginData } from 'models/login-data.interface';
import { UserModel } from 'models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  // Sign a user in with email and password
  signUserInWithEmailAndPassword(user: LoginData) {
    // Sign the user in 
    return this.auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
      this.setUserInLocalStorage(); // Set the users uid in local storage 
      // !! UNCOMMENT WHEN I NEED TO ADD MYSELF BACK TO USERS COLLECTION  !!
      //this.setUserInDatabase(); 
      this.updateUserUidInDatabase();
    });
  }

  // Register a new user with an email and password
  registerUserWithEmailAndPassword(user: LoginData) {
    // Register a new user
    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {
      this.setUserInDatabase();
    }).then(() => {this.setUserInLocalStorage()}); // Finally set the users uid in local storage
  }

  // Send a password reset email to a specified email address
  sendPasswordResetEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  // Sign out a currently signed in user
  signOutCurrentUser() {
    this.auth.signOut();
  }

  // Set the current user in local storage
  setUserInLocalStorage() {
    this.auth.authState.subscribe(user => {
      if(user) {
        localStorage.setItem('userUid', JSON.stringify(user.uid));
      } else localStorage.setItem('userUid', null);
    })
  }

  // Store a UserModel in the users collection for a specified firebase.User
  setUserInDatabase() {
    this.auth.authState.subscribe( obs => {
      try {
        if(obs !== null)
        {
          let userModel = this.getUserModel(obs);
          this.db.collection('users').doc(userModel.uid).set(userModel);
        } else throw new Error('User is not logged in');
      } catch(err){console.log(err);}
    })
  }

  updateUserUidInDatabase()
  {
    let uid = this.getUid();
    if(uid != null)
    {
      return this.db.collection('users').doc(uid).set({'uid' : uid}, {merge: true});
    }
  }

  // Return a UserModel object from a firebase.User object
  private getUserModel(fbUser : firebase.User) {
    let user : UserModel;
    user = {
      uid: fbUser.uid,
      email: fbUser.email,
      emailVerified: fbUser.emailVerified,
      displayName: '@'+fbUser.email.substring(0,fbUser.email.indexOf('@')),
      photoURL: fbUser.photoURL,
      friends: []
    }
    return user;
  }

  userLoggedIn() {
    if(localStorage.getItem('userUid') != null)
    {
      return true;
    } else return false;
  }

  getUid() {
    let uid = localStorage.getItem('userUid');
    uid = uid.substring(1,uid.length - 1);
    return uid;
  }
}