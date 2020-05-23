import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  View,
  Alert,
  TextInput,
  Text
} from 'react-native'
// import RadioGroup from 'react-native-radio-buttons-group';
import { Input } from 'react-native-elements';

import { CREATE_USER } from '../queries/CreateUser';
import { IUserInput, IUser } from '../types';
import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText,
} from './shared';
import { CreateUserFnContext } from './CreateUserContainer';

interface ICreateUser {
  navigation: any;
  route: any;
  numUser: number;
  saveUserInfo(userInfo: IUserInput): void;
}

const CreateUser: React.FC<ICreateUser> = props => {
  console.log('createUser props', props);

  const MyContext = useContext(CreateUserFnContext);
  console.log('MyContext', MyContext)

  const [curState, setState] = useState<IUserInput>({
    name: 'test name',
    email: 'test01@gmail.com',
    password: 'test01',
    confirmPassword: 'test01',
    phoneNumber: '',
    userType: 'Student',
    classes: 'Math'
  });

  const handleTextChange = (name: string) => (text: string) => setState({...curState, [name]: text})

  const [createUserMut, { error }] = useMutation(
    CREATE_USER,
    {
      onCompleted: () => {
        Alert.alert('Thank you for joining Emphasis Education!');
      }
    }
  )

  if (error) {
    console.log('there was something wrong with creating the user');
    console.log(error);
  }

  const createUser = () => {
    console.log('running create user mutation')
    createUserMut({
      variables: {
        email: curState.email,
        password: curState.password,
        userType: curState.userType
      }
    })
  }

  const GoToLogin = () => {
    // run createUserMutation here
    props.navigation.navigate('Login')
  }

  const addMember = () => {
    // se need to write this info to the parent state
    console.log('saving')
    // if (props.saveUserInfo) {
    //   props.saveUserInfo(curState)
    // } else {
    //   props.route.params.save(curState)
    // }

    MyContext.save(curState);
    props.navigation.push(
      'CreateUser',
    )
  }

  // maybe split the create user flow up into multiple screens?
  return (
    <View>
      <Text>this is fam member number: {props.numUser}</Text>
      <MytextInput
        placeholder='name'
        value={curState.name}
        onChangeText={handleTextChange('name')}
      />
      <Input
        placeholder='email'
        onChangeText={handleTextChange('email')}
        value={curState.email}
        label={'email'}
      />
      {/* <MytextInput
        placeholder='email'
        value={curState.email}
        onChangeText={handleTextChange('email')}
      /> */}
      <MytextInput
        placeholder='password'
        value={curState.password}
        onChangeText={handleTextChange('password')}
      />
      <MytextInput
        placeholder='confirm password'
        value={curState.confirmPassword}
        onChangeText={handleTextChange('confirmPassword')}
      />
      <MytextInput
        placeholder='user type'
        value={curState.userType}
        onChangeText={handleTextChange('userType')}
      />
      <MytextInput
        placeholder='classes'
        value={curState.classes}
        onChangeText={handleTextChange('classes')}
      />

      <ButtonContainer>
        <MyButton>
          <MyButtonText
            onPress={addMember}
          >
            Add another member
          </MyButtonText>
        </MyButton>
      </ButtonContainer>

      <ButtonContainer>
        <MyButton
          onPress={GoToLogin}
        >
          <MyButtonText>
            Submit
          </MyButtonText>
        </MyButton>
      </ButtonContainer>
    </View>
  )
}

export default CreateUser;
