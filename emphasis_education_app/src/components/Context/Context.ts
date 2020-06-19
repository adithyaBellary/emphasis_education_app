import * as React from 'react';
import { IUser, Permission } from '../../types';

interface IContext {
  loggedUser: IUser;
  setUser( user: IUser): void;
}

export let EmptyUser: IUser = {
  name: '',
  email: '',
  phoneNumber: '',
  groupID: '',
  userType: Permission.Student,
  chatIDs: ['chat1', 'chat2'],
  classes: [],
  _id: '_id',
  gender: 'F'
}

const setUser = (user: IUser) => {
  console.log('calling setuser in context')
  EmptyUser = user;
}

export const DummyData: IContext = {
  loggedUser: EmptyUser,
  setUser: setUser,
}

const CreateUserFnContext = React.createContext<IContext>({} as any);

export default CreateUserFnContext;
