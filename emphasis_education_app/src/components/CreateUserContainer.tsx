import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  View,
} from 'react-native';

import { IUserInput, IUser } from '../types';
import CreateUser from './CreateUser';
import { CREATE_USER } from '../queries/CreateUser';

interface ICreateUserContainProps {
  navigation: any;
  route: any;
}

interface ICreateUserArr {
  users: IUserInput[];
}
interface IContext {
  save(info: IUserInput): void;
  create(): void;
}
// seems like some shananigans? but whatever
export const CreateUserFnContext = React.createContext<IContext>({
  save: (info: IUserInput) => {},
  create: () => {}
});

const CreateUserContain: React.FC<ICreateUserContainProps> = props => {
  const [userInfo, setUserInfo] = React.useState<ICreateUserArr>();
  const [numUsers, setNumUsers] = React.useState<number>(1);

  // make this into our owh custom hook
  const updateUserInfo = (newUserInfo: IUserInput): void => {
    console.log('newUserInfo', newUserInfo);
    if (!userInfo) {
      setUserInfo({
        users: [
          newUserInfo
        ]
      })
      return;
    }
    setUserInfo({
      users: [
        ...userInfo.users,
        newUserInfo
      ]
    })
  }

  const runCreateUserMut = () => {

    console.log('creating users with', userInfo)
  }

  const CreateUserFn = {
    save: updateUserInfo,
    create: runCreateUserMut
  }

  return (
    <CreateUserFnContext.Provider
      value={CreateUserFn}
    >
      <View>
        <CreateUser
          saveUserInfo={updateUserInfo}
          numUser={numUsers}
          {...props}
          />
      </View>
    </CreateUserFnContext.Provider>
  )
}

export default CreateUserContain;
