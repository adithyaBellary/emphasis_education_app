import * as React from 'react';
import { IUser } from '../../types';

// This number can be used to display in the app icon.
// in the chat picker, we can display whether there are any unread messages
export interface INotifications {
  // this could also be a boolean instead
  [x: string]: number
}

export interface IContext {
  // manage number of notifications for each chat
  notifications: INotifications;
  loggedUser: IUser;
  incrementNotificationCounter (chatID: string): void;
  clearNotificationCounter (chatID: string): void;
  setUser( user: IUser): void;
}

interface IAuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<IAuthContextProps>({} as any);

export const GeneralContext = React.createContext<IContext>({} as any);
