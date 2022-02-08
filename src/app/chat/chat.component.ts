import { Component, OnInit } from '@angular/core';

import { UserModel } from 'models/user.model';
import { GroupModel } from 'models/group.model';
import { GroupMember } from "models/group.member.model";
import { MessageModel } from "models/message.model";
import { FirebaseGroupModel } from 'models/firebase.group.model';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

declare function require(name:string);


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  user: UserModel;
  groups: Array<GroupModel>;
  index: number;
  formActive: boolean;
  formData: any;
  private displayNameLookUpTable: Array<GroupMember>;

  constructor( 
    private db: AngularFirestore, 
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.formActive = false;
    // If a user is logged in then retrieve their UserModel from the users collection
    if(this.authService.userLoggedIn()) {
      this.db.collection('users').doc(this.authService.getUid()).get().toPromise().then((doc)=>{
        this.user = {
            uid: doc.get('uid'),
            email: doc.get('email'),
            emailVerified: doc.get('emailVerified'),
            displayName: doc.get('displayName'),
            photoURL: doc.get('photoURL'),
            friends: doc.get('friends')
        }
      })
      .then(() => {
        this.getGroups(); // Fill the `usersGroups` array with data from the firestore
      })
    } else {this.router.navigate(['']);} // If no user is currently logged in then navigate to login component
  }

  private getGroups() {
    this.db.collection<any>('groups', ref => ref.where('members', 'array-contains', this.user.uid))
      .valueChanges().subscribe(snapshot =>{
          this.groups = [];
          snapshot.forEach(obj => {
            this.groups.push({
                abbr: this.getGroupAbbreviations(obj),
                name: obj.name,
                ownerUid: obj.ownerUid,
                uid: obj.uid,
                members: obj.members,
                messages: this.mapMessages(obj.messages)
            })
          })
          this.getDisplayNames();
      });
  }

  private getDisplayNames() {
      let mbrs = []; // Store all the members uids
      // Loop through each group
      for(let i=0; i<this.groups.length;i++) {
          // Loop through the members of a group
          for(let j=0; j<this.groups[i].members.length; j++) {
              // If we find a new uid then add it to the list
              if(!mbrs.includes(this.groups[i].members[j])) {
                  mbrs.push(this.groups[i].members[j]);
              }
          }
      }
      // Now that we have all the members, ask firestore for their display names
      mbrs.forEach(uid => {
          this.db.collection('users').doc(uid).get().toPromise().then(doc => {
              this.addDisplayNameToLookUpTable(uid, doc.get('displayName'));
          })
      })
  }

  private addDisplayNameToLookUpTable(uid: string, name: string) {
    // If the look up table is not initialized then initialize it
    if(this.displayNameLookUpTable == undefined){this.displayNameLookUpTable = [];}
    // If the uid is not in the look up table then add it 
    if(!this.contains(uid)) {
        this.displayNameLookUpTable.push({
            uid: uid,
            name: name
        })
    }
    // Otherwise only edit the entry in the look up table if the has been a change to the name
    else {
        for(let i=0; i<this.displayNameLookUpTable.length; i++) {
            if(this.displayNameLookUpTable[i].uid == uid && this.displayNameLookUpTable[i].name != name) {
                this.displayNameLookUpTable[i].name = name;
            }
        }
    }
  }

  // Check if a uid is contained in the look up table
  private contains(uid: string ): boolean {
      for(let i=0; i< this.displayNameLookUpTable.length; i++) {
          if(this.displayNameLookUpTable[i].uid == uid) {
              return true;
          }
      }
      return false;
  }

  matchUidToDisplayName(uid: string){
      for(let i=0; i<this.displayNameLookUpTable.length; i++) {
          if(this.displayNameLookUpTable[i].uid == uid) return this.displayNameLookUpTable[i].name;
      }
  }

  private mapMessages(obj): Array<MessageModel> {
      let msgs: Array<MessageModel> = [];
      obj.forEach(element => {
          msgs.push({
              senderUid: element.sender,
              timestamp: element.timestamp,
              content: element.content,
              class: ""
          })
      });
      return msgs;
  }

  // Format Unix timestamp the human readable
  convertUnixTime(unix: string): string {
      var date = new Date(parseInt(unix)).toLocaleDateString('en-UK');
      var time = new Date(parseInt(unix)).toLocaleTimeString('en-UK');
      return date + ', ' + time;
  }

  /*  Map the group name stored in a snapshot to an abbreviated version */
  private getGroupAbbreviations(obj: any)
  {
    if(obj.name.includes(' '))
      {
        return obj.name.split(' ').map(word => word[0]).join('');
      }
      else if(obj.name.includes('-'))
      {
        return obj.name.split('-').map(word => word[0]).join('');
      }
  }

  /*  Switch the active group when icon is clicked */
  switchActiveGroup(uid: any) {
    // If the home icon is clicked, set the index to undefined
    if(uid == undefined) {this.index = undefined; return;}
    // If the add icon is clicked, set index undefined and formActive true
    if(uid == 'new group') {this.index = undefined; this.formActive = true; return;}
    // Set the index to the clicked groups index
    for(let i=0; i<this.groups.length; i++) {
        if(this.groups[i].uid == uid) {
            this.index = i;
            // Sort the messages based on timestamp
            this.groups[i].messages.sort(function(x,y){
                return parseInt(x.timestamp) - parseInt(y.timestamp);
            })
        }
    }
  }

  createNewMessage(formData: any) {
    const firebase = require('firebase/app');
    let message: any = {
        sender: this.user.uid,
        timestamp: Date.now()+"",
        content: formData.value.messageContent,
    }
    this.db.collection('groups').doc(this.groups[this.index].uid).set({
        "messages": firebase.firestore.FieldValue.arrayUnion(message)
    }, 
    {merge: true})
  }

  // Create a new group from the create-group-form data
  createNewGroup(formData: any) {
    // Special case 'Close' will be returned, indicating to close the form
    if(formData == 'Close') {
      this.formActive = false;
      return;
    }
    // Make sure we have a valid form
    else if(formData.form.status == 'INVALID') return;
    // Create a new group document
    else {
      let doc:FirebaseGroupModel = {
        members: [this.user.uid],
        messages: [],
        name: formData.form.value.name,
        ownerUid: this.user.uid,
        uid: ''
      }
      // Add the new document to the firestore
      this.db.collection('groups').add(doc).then(res => {
        this.formActive = false; // Close the form
        // Update the new document in the firestore with its own id
        this.db.collection('groups').doc(res.id).update({
          uid: res.id
        }).then(() => {
          // Switch to the new group
          this.switchActiveGroup(res.id);
        })
      })
    }
  }
}
