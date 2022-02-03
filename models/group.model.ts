import { GroupMember } from "./group.member.model";
import { MessageModel } from "./message.model";

export interface GroupModel {
    members: Array<GroupMember>,
    messages: Array<MessageModel>,
    abbr: any,
    name: any,
    ownerUid: any,
    uid: any
}