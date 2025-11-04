import type { IUser } from "./User";

export interface IPost {
  _id: string;
  title: string;
  content: string;
  author: IUser;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}