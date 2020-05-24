import React, { useState, useContext } from 'react';
import {
  View,
  Alert,
  TextInput,
  Text
} from 'react-native'
// import RadioGroup from 'react-native-radio-buttons-group';
import { Input } from 'react-native-elements';

import { IUserInput, IUser } from '../types';
import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText,
} from './shared';
import { CreateUserFnContext } from './Context';

interface ICreateUser {
  navigation: any;
  route: any;
  // numUser: number;
  GoToConfirmationScreen(): void;
  saveUserInfo(userInfo: IUserInput): void;
  // createUserFn(): void;
}

const EmptyData: IUserInput = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  userType: '',
  classes: ''
}

const CreateUser: React.FC<ICreateUser> = props => {
  // console.log('createUser props', props);
  const [numUser, setNumUser] = React.useState<number>(1)

  const MyContext = useContext(CreateUserFnContext);
  // console.log('MyContext', MyContext)

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
  const clearData = () => setState(EmptyData);

  const GoToConf = () => {
    // MyContext.save(curState);
    // MyContext.goToConfirmationScreen();
    // MyContext.create()

    // props.navigation.navigate('Login')
    props.saveUserInfo(curState);
    props.GoToConfirmationScreen()
    // props.navigation.navigate('ConfirmationScreen')
  }

  const addMember = () => {
    // instead, lets clear the input screen and then increment the counter at the top
    props.saveUserInfo(curState);
    setNumUser(numUser + 1);
    clearData();
    // MyContext.save(curState);
    // props.navigation.push(
    //   'CreateUser',
    // )
  }

  return (
    <View>
      <Text>this is fam member number: {numUser}</Text>
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
          onPress={GoToConf}
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
