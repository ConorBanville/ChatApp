export interface UserModel {
    uid: string,
    email: string | null,
    emailVerified: boolean,
    displayName: string | null,
    photoURL: string | null,
    friends : []
}