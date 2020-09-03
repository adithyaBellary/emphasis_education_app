import * as React from 'react';
import { IUser } from '../../types';

// This number can be used to display in the app icon.
// in the chat picker, we can display whether there are any unread messages
export interface INotifications {
  [x: string]: number
}

// make this a general purpose context?
export interface IContext {
  // manage number of notifications for each chat
  notifications: INotifications;
  loggedUser: IUser;
  incrementNotificationCounter (chatID: string): void;
  setUser( user: IUser): void;
}

// const setNotifications = (chatID: string) => {
//   notifications
// }

interface IAuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<IAuthContextProps>({} as any);

export const GeneralContext = React.createContext<IContext>({} as any);

// export default CreateUserFnContext;
