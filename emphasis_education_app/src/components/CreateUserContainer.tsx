import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Alert,
  View,
} from 'react-native';

import { IUserInput, IUser } from '../types';
import CreateUser from './CreateUser';
import { CREATE_USER } from '../queries/CreateUser';

import { CreateUserFnContext } from './Context';
import  ConfirmationScreen  from './ConfirmationScreen';

interface ICreateUserContainProps {
  navigation: any;
  route: any;
}

interface ICreateUserArr {
  users: IUserInput[];
}

// seems like some shananigans? but whatever
// interface IContext {
//   save(info: IUserInput): void;
//   create(): void;
//   goToConfirmationScreen(): void;
// }

// const CreateUserFnContext = React.createContext<IContext>({
//   save: (info: IUserInput) => {console.log('debugging')},
//   create: () => {},
//   goToConfirmationScreen: () => {}
// });

const Test = () => {
  const [hi, setHi] = React.useState(true)
}

const CreateUserContain: React.FC<ICreateUserContainProps> = props => {
  const [userInfo, setUserInfo] = React.useState<ICreateUserArr>();
  const [showConf, setSHowConf] = React.useState(false);
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
    createUserMut({
      variables: {
        users: userInfo!.users
      }
    })
    console.log('creating users with', userInfo)
  }

  const GoToCOnfirmation = () => {
    console.log('going to conf screen', userInfo)
    setSHowConf(true);

    // props.navigation.navigate(
    //   'ConfirmationScreen',
    //   {
    //     users: userInfo
    //   }
    // )
  }

  if (error) {
    console.log('there was something wrong with creating the user');
    console.log(error);
  }

  const CreateUserFn = {
    save: updateUserInfo,
    create: runCreateUserMut,
    goToConfirmationScreen: GoToCOnfirmation
  }

  return (
    <CreateUserFnContext.Provider
      value={CreateUserFn}
    >
      <View>
        {!showConf && (
          <CreateUser
            saveUserInfo={updateUserInfo}
            GoToConfirmationScreen={GoToCOnfirmation}
            {...props}
          />
        )}
        {showConf && (
          <ConfirmationScreen
            users={userInfo}
            submit={runCreateUserMut}
          />
        )}
      </View>
    </CreateUserFnContext.Provider>
  )
}

export default CreateUserContain;
