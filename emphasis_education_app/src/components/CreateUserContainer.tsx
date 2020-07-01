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
import { AuthContext } from './Context/Context';


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

  React.useEffect(() => {
    if (showConf) {
      props.navigation.setOptions({
        title: 'Create User Confirmation'
      })
    }
  }, [showConf])

  // make this into our own custom hook
  const updateUserInfo = (newUserInfo: IUserInput): void => {
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
        // or if we want to go automatically
        // props.navigation.navigate('Login')
      }
    }
  )

  const runCreateUserMut = (): void => {
    console.log('userInfo before running mutaion', userInfo)
    const _users: IUsableUserInfo[] = userInfo.users.map(({confirmPassword, ...rest }) => {
      return rest;
    })
    console.log('userInfo before running mutaion', _users)
    createUserMut({
      variables: {
        users: _users
      },
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
