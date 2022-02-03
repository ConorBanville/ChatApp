// import { Component, OnInit } from '@angular/core';

// import { UserModel } from 'models/user.model';
// import { GroupModel } from 'models/group.model';
// import { GroupMember } from 'models/group.member.model';
// import { MessageModel } from 'models/message.model';

// import { AngularFirestore } from '@angular/fire/firestore';
// import { AuthService } from '../auth.service';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent implements OnInit {

//   activeUser: UserModel;
//   usersGroups: Array<GroupModel>;
//   groupMembers: Array<GroupMember>;
//   activeMessages: Array<MessageModel>;
//   activeGroupIndex: number;

//   constructor( 
//     private db: AngularFirestore, 
//     private authService: AuthService,
//     private router: Router
//     ) { }

//   ngOnInit(): void {
//     // If a user is logged in then retrieve their UserModel from the users collection
//     if(this.authService.userLoggedIn())
//     {
//       this.db.collection('users').doc(this.authService.getUid()).get().toPromise().then((doc)=>{
//         this.activeUser = {
//           uid: doc.get('uid'),
//           email: doc.get('email'),
//           emailVerified: doc.get('emailVerified'),
//           displayName: doc.get('displayName'),
//           photoURL: doc.get('photoURL'),
//           friends: doc.get('friends')
//         }
//       })
//       .then(() => {
//         this.getActiveUserGroups(); // Fill the `usersGroups` array with data from the firestore
//       });
//     } else {this.router.navigate(['']);} // If no user is currently logged in then navigate to login component
//   }

//   /*  Build the local object[] `usersGroups`, with data from the groups stored in the Firestore.
//       Only groups that the active user is a member of will be retrieved from the Firestore.
//   */
//   private getActiveUserGroups()
//   {
//     if(this.activeUser != null)
//     {
//       this.db.collection<any>('groups', ref => ref.where('members', 'array-contains', this.activeUser.uid))
//       .valueChanges().subscribe(snapshot =>{
//           this.usersGroups = [];
//           snapshot.forEach(obj => {
//             this.usersGroups.push({
//               members: obj.members,
//               messages: obj.messages,
//               abbr: this.getGroupAbbreviations(obj),
//               name: obj.name,
//               ownerUid: obj.ownerUid,
//               uid: obj.uid
//             })
//           });
//         }
//       );
//     }
//   }

//   /*  Map the group name stored in a snapshot to an abbreviated version */
//   private getGroupAbbreviations(obj: any)
//   {
//     if(obj.name.includes(' '))
//       {
//         return obj.name.split(' ').map(word => word[0]).join('');
//       }
//       else if(obj.name.includes('-'))
//       {
//         return obj.name.split('-').map(word => word[0]).join('');
//       }
//   }

//   /*  Take the member uid's from the active group and query Firestore for
//       the members corresonding display names, this isn't done with a 
//       keep-alive connection so if the display names change while the 
//       group is active they will not update*/
//   private getDisplayNames() {
//     if(this.activeUser != null && this.usersGroups != undefined && this.activeGroupIndex != undefined)
//     {
//       this.groupMembers = [];
//       this.usersGroups[this.activeGroupIndex].members.forEach(uid => {
//         this.db.collection("users").doc(uid).get().toPromise().then((doc) =>{
//           this.groupMembers.push({
//             uid: uid,
//             name: doc.get('displayName')
//           })
//         })
//         .then(() => {
//           if(this.usersGroups[this.activeGroupIndex].members.length == this.groupMembers.length)
//           {
//             this.buildMessages(this.usersGroups[this.activeGroupIndex].messages, this.groupMembers);
//           }        
//         })
//       });
//     }
//   }

//   private buildMessages(messages:Array<any>, groupMembers: Array<GroupMember>) {
//     this.activeMessages = [];
//     messages.forEach(msg => {
//       groupMembers.forEach(member => {
//         if(msg.sender === member.uid)
//         {
//           this.activeMessages.push({
//             senderUid: member.uid,
//             senderName: member.name,
//             timestamp: msg.timestamp,
//             content: msg.content
//           })
//         }
//       })
//     })
//     console.log(this.activeMessages);
//   }

//   /*  Switch the active group when icon is clicked */
//   switchActiveGroup(uid: any) {
//     // undefined is passed when the Home icon is clicked
//     if(uid == undefined) {this.activeGroupIndex = undefined; this.groupMembers = undefined; return;}
//     // Go through the users stored groups and match the uid, setting the activeGroup index
//     for(let i=0; i<this.usersGroups.length; i++)
//     {
//       if(uid === this.usersGroups[i].uid)
//       {
//         this.activeGroupIndex = i;
//         this.getDisplayNames();
//       }
//     }
//   }
// }
