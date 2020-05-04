import { userType } from './userType';

export interface messageType {
  _id: number;
  text: string;
  user: userType;
  chatID: string;
  // createdAt: Date;
}
