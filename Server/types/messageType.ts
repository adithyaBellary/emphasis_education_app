import { userType } from './userType';

export interface messageType {
  id: number;
  text: string;
  user: userType;
  // createdAt: Date;
}
