export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  firebaseUid?: string;
}