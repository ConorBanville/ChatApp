import { MessageModel } from "./message.model";

export interface GroupModel {
    members: Array<string>,
    messages: Array<MessageModel>,
    abbr: any,
    name: any,
    ownerUid: any,
    uid: any
}