import * as React from 'react';
import { UserInfoType } from '../../../types/schema-types';

// This number can be used to display in the app icon.
// in the chat picker, we can display whether there are any unread messages
export interface NotificationsProps{
  // [x: string]: boolean
  [x: string]: {
    chatID: string,
    isAdmin: boolean
  }
}

export interface Context {
  // manage number of notifications for each chat
  notifications: NotificationsProps;
  loggedUser: UserInfoType;
  updateNotifications (chatID: string, isAdmin: boolean): void;
  clearNotificationCounter (chatID: string): void;
  setUser (user: UserInfoType): void;
  notificationBadge: boolean;
  setNotificationBadge (status: boolean): void;
  setNotifications: any
}

interface AuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<AuthContextProps>({} as any);

export const GeneralContext = React.createContext<Context>({} as any);
