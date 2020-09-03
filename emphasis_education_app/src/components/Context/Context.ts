import * as React from 'react';
import { IUser } from '../../types';

interface Notifications {
  [x: string]: number
}

// make this a general purpose context?
export interface IContext {
  // manage number of notifications for each chat
  notifications: Notifications;
  loggedUser: IUser;
  setUser( user: IUser): void;
}

interface IAuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<IAuthContextProps>({} as any);

export const GeneralContext = React.createContext<IContext>({} as any);

// export default CreateUserFnContext;
