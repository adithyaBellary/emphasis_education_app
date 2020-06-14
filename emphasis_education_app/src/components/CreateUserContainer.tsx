import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Alert,
  View,
} from 'react-native';

import { IUserInput, IUsableUserInfo, ICreateUserPayload } from '../types';
import CreateUser from './CreateUser';
import { CREATE_USER } from '../queries/CreateUser';

import  ConfirmationScreen  from './ConfirmationScreen';

interface ICreateUserContainProps {
  navigation: any;
  route: any;
}
const SuccessMessaging: string = 'Thanks for joining Emphasis Education';
const ErrorMessaging: string = 'Something went wrong creating this user';

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

  const [createUserMut, { loading, error }] = useMutation<ICreateUserPayload>(
    CREATE_USER,
    {
      onCompleted: ({ createUser }) => {
        Alert.alert(createUser.success ? SuccessMessaging : ErrorMessaging );
      }
    }
  )

  React.useEffect(() => {
    console.log('changes', userInfo)
  }, [userInfo])

  const runCreateUserMut = (): void => {
    console.log('userInfo before running mutaion', userInfo)
    const _users: IUsableUserInfo[] = userInfo.users.map(({confirmPassword, ...rest }) => {
      return rest;
    })
    console.log('userInfo before running mutaion', _users)
    createUserMut({
      variables: {
        users: _users
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
          loading={loading}
        />
      )}
    </View>
  )
}

export default CreateUserContain;
