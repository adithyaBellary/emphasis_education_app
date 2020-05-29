import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Alert,
  View,
} from 'react-native';

import { IUserInput, IUsableUserInfo } from '../types';
import CreateUser from './CreateUser';
import { CREATE_USER } from '../queries/CreateUser';

import  ConfirmationScreen  from './ConfirmationScreen';

interface ICreateUserContainProps {
  navigation: any;
  route: any;
}

export interface ICreateUserArr {
  users: IUserInput[];
}

const CreateUserContain: React.FC<ICreateUserContainProps> = props => {
  const [userInfo, setUserInfo] = React.useState<ICreateUserArr>();
  const [showConf, setSHowConf] = React.useState(false);

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

  const [createUserMut, { error }] = useMutation(
    CREATE_USER,
    {
      onCompleted: () => {
        Alert.alert('Thank you for joining Emphasis Education!');
      }
    }
  )

  React.useEffect(() => {
    console.log('changes', userInfo)
  }, [userInfo])

  const runCreateUserMut = (): void => {
    console.log('userInfo before running mutaion', userInfo)
    const usableInfo: IUsableUserInfo[] = userInfo.users.map(({confirmPassword, ...rest }) => {
      return rest;
    })
    console.log('userInfo before running mutaion', usableInfo)
    createUserMut({
      variables: {
        users: usableInfo
      }
    })
  }

  const GoToConfirmation = () => {
    console.log('going to conf screen', userInfo)
    setSHowConf(true);
  }

  if (error) {
    console.log('there was something wrong with creating the user');
    console.log(error);
  }

  return (
    <View>
      {!showConf && (
        <CreateUser
          saveUserInfo={updateUserInfo}
          GoToConfirmationScreen={GoToConfirmation}
          {...props}
        />
      )}
      {showConf && (
        <ConfirmationScreen
          createdUsers={userInfo}
          submit={runCreateUserMut}
        />
      )}
    </View>
  )
}

export default CreateUserContain;
