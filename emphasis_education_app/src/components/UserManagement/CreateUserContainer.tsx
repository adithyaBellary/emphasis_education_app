import * as React from 'react';
import { useMutation } from '@apollo/client';
import {
  Alert,
  View,
} from 'react-native';

import { IUserInput, IUsableUserInfo, GenericResponse } from '../../types';
import CreateUser from './CreateUser';
import { CREATE_USER } from '../../queries/CreateUser';

import  ConfirmationScreen  from './ConfirmationScreen';

interface CreateUserContainProps {
  navigation: any;
  route: any;
}
const SuccessMessaging: string = 'Thank you for joining Emphasis Education!';
const ErrorMessaging: string = 'There was an issue creating this user';

export interface CreateUserArr {
  users: IUserInput[];
}

const CreateUserContain: React.FC<CreateUserContainProps> = props => {
  const [userInfo, setUserInfo] = React.useState<CreateUserArr>();
  const [showConf, setShowConf] = React.useState(false);
  const [submitDisabled, setSubmitDisabled] = React.useState(false);

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

  const [createUserMut, { data, loading, error }] = useMutation(
    CREATE_USER,
    {
      onCompleted: ({ createUser }) => {
        console.log('Done running create user mutation: ', createUser)
        const { res, message }: GenericResponse = createUser;
        Alert.alert(res ? SuccessMessaging : message || ErrorMessaging );
        setSubmitDisabled(true);
      }
    }
  )

  if(error) {
    Alert.alert(data?.message || 'Something went wrong creating this user!!! unique')
  }


  const runCreateUserMut = (): void => {
    const _users: IUsableUserInfo[] = userInfo.users.map(({confirmPassword, ...rest }) => {
      return rest;
    })
    // console.log('userInfo before running mutaion', _users)
    createUserMut({
      variables: {
        users: _users
      },
    })
  }

  const GoToConfirmation = () => {
    console.log('going to conf screen', userInfo)
    setShowConf(true);
  }

  // if (error) {
  //   console.log('there was something wrong with creating the user');
  //   console.log(error);
  // }

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
          navigation={props.navigation}
          submitDisabled={submitDisabled}
        />
      )}
    </View>
  )
}

export default CreateUserContain;
