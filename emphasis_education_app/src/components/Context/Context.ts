import * as React from 'react';
import { IUser } from '../../types';

export interface IContext {
  loggedUser: IUser;
  setUser( user: IUser): void;
}

interface IAuthContextProps {
  login: any;
  logout: any
  createUser: any;
}

export const AuthContext = React.createContext<IAuthContextProps>({} as any);

const CreateUserFnContext = React.createContext<IContext>({} as any);

export default CreateUserFnContext;
