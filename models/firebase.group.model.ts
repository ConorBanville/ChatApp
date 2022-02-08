export interface FirebaseGroupModel {
    members: Array<string>,
    messages: Array<MessageModel>,
    name: string,
    ownerUid: string,
    uid: string
}

interface MessageModel {
    content: string,
    sender: string,
    timestamp: string
}