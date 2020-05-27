import * as React from 'react';
import { IUserInput, IUser, Permission } from '../../types';

interface IContext {
  // need a way to set data for the userobject
  loggedUser: IUser;
  // setUser(user: IUser): void;
  // figure out typing for the setting function
  setUser: any
  // save(info: IUserInput): void;
  // create(): void;
  // goToConfirmationScreen(): void;
}

export let EmptyUser: IUser = {
  name: '',
  email: '',
  password: '',
  phoneNumber: '',
  userType: Permission.Student
}

const setUser = (user: IUser) => {
  console.log('calling setuser in context')
  EmptyUser = user;
}

export const DummyData: IContext = {
  loggedUser: EmptyUser,
  setUser: setUser,
  // save: (info: IUserInput) => {console.log('debugging')},
  // create: () => {},
  // goToConfirmationScreen: () => {},
}

const CreateUserFnContext = React.createContext<IContext>(DummyData);

export default CreateUserFnContext;
