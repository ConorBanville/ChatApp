import { Component, OnInit } from '@angular/core';

import { UserModel } from 'models/user.model';
import { GroupModel } from 'models/group.model';
import { GroupMember } from "models/group.member.model";
import { MessageModel } from "models/message.model";

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';;


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  user: UserModel;
  groups: Array<GroupModel>;
  index: number;
  private displayNameLookUpTable: Array<GroupMember>;

  count: number;

  constructor( 
    private db: AngularFirestore, 
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // If a user is logged in then retrieve their UserModel from the users collection
    this.count = 0;
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
                members: this.mapMembers(obj.members),
                messages: this.mapMessages(obj.messages)
            })
          })
          this.getDisplayNames();
      });
  }

  private getDisplayNames() {
      let mbrs = [];
      this.displayNameLookUpTable = [];
      for(let i=0; i<this.groups.length;i++) {
          for(let j=0; j<this.groups[i].members.length; j++) {
              if(!mbrs.includes(this.groups[i].members[j].uid)) {
                  mbrs.push(this.groups[i].members[j].uid);
                  this.db.collection('users').doc(this.groups[i].members[j].uid)
                  .get().toPromise().then((doc => {
                    let temp: GroupMember = {
                        uid: this.groups[i].members[j].uid,
                        name: doc.get('displayName')
                    }
                    if(!this.displayNameLookUpTable.includes(temp)) {
                        this.displayNameLookUpTable.push(temp);  
                    }
                  }))
              }
          }
      }
  }

  private matchUidToDisplayName(lookupTable: Array<GroupMember>, uid: string) {
      for(let i=0; i<lookupTable.length; i++) {
          if(lookupTable[i].uid == uid) return lookupTable[i].name;
      }
  }

  private mapMembers(obj): Array<GroupMember>{
    let mbrs: Array<GroupMember> = [];
    obj.forEach(element => {
        mbrs.push({
            uid: element,
            name: ''
        })
    });
    return mbrs;
  }

  private mapMessages(obj): Array<MessageModel> {
      let msgs: Array<MessageModel> = [];
      obj.forEach(element => {
          msgs.push({
              senderUid: element.sender,
              senderName: '',
              timestamp: element.timestamp,
              content: element.content
          })
      });
      return msgs;
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
    if(uid == undefined) {this.index = undefined; return;}
    this.count ++;
    for(let i=0; i<this.groups.length; i++) {
        if(uid === this.groups[i].uid) {
            this.index = i;
            for(let j=0; j<this.groups[i].members.length; j++) {
                this.groups[i].members[j] = {
                    uid : this.groups[i].members[j].uid,
                    name: this.matchUidToDisplayName( this.displayNameLookUpTable, this.groups[i].members[j].uid)
                }
            }
            for(let j=0; j<this.groups[i].messages.length; j++) {
                this.groups[i].messages[j] = {
                    senderUid: this.groups[i].messages[j].senderUid,
                    senderName: this.matchUidToDisplayName( this.displayNameLookUpTable, this.groups[i].messages[j].senderUid),
                    timestamp: this.groups[i].messages[j].timestamp,
                    content: this.groups[i].messages[j].content
                }
            }
        }
    }
    if(this.count >= this.groups.length) console.log(this.groups);
  }
}
