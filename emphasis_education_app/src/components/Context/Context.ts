import * as React from 'react';
import { UserInfoType } from '../../../types/schema-types';

// This number can be used to display in the app icon.
// in the chat picker, we can display whether there are any unread messages
export interface NotificationsProps{
  // this could also be a boolean instead
  [x: string]: number
}

export interface Context {
  // manage number of notifications for each chat
  notifications: NotificationsProps;
  // loggedUser: IUser;
  loggedUser: UserInfoType;
  incrementNotificationCounter (chatID: string): void;
  clearNotificationCounter (chatID: string): void;
  // setUser( user: IUser): void;
  setUser( user: UserInfoType): void;
}

interface AuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<AuthContextProps>({} as any);

export const GeneralContext = React.createContext<Context>({} as any);
