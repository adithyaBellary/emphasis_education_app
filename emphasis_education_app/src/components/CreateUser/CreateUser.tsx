import React, { useState } from 'react';
import {
  View,
  Text
} from 'react-native'

import { IUserInput, Permission } from '../../types';
import {
  CenteredDiv,
  ButtonContainer,
  RadioButtonGroup,
  ThemedTextInput,
  ButtonGroupContain,
  ThemedButton
} from '../shared';

interface ICreateUser {
  navigation: any;
  route: any;
  GoToConfirmationScreen(): void;
  saveUserInfo(userInfo: IUserInput): void;
}

const EmptyData: IUserInput = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  userType: Permission.Student,
  gender: ''
}

const CreateUser: React.FC<ICreateUser> = props => {
  const [numUser, setNumUser] = React.useState<number>(1)

  const [curState, setState] = useState<IUserInput>({
    name: 'test name',
    email: 'test01@gmail.com',
    password: 'test01',
    confirmPassword: 'test01',
    phoneNumber: '2',
    userType: Permission.Student,
    gender: ''
  });

  const handleTextChange = (name: string) => (text: string) => setState({...curState, [name]: text})
  const clearData = () => setState(EmptyData);

  const canSubmit = (): boolean => {
    return !!curState.name &&
     !!curState.phoneNumber
  }

  const GoToConf = () => {
    props.saveUserInfo(curState);
    props.GoToConfirmationScreen()
  }

  const addMember = () => {
    props.saveUserInfo(curState);
    setNumUser(numUser + 1);
    clearData();
  }

  return (
    <View>
      <CenteredDiv>
        <Text>Family member number {numUser}</Text>
        <ThemedTextInput
          placeholder='Nmae'
          value={curState.name}
          onChangeText={handleTextChange('name')}
        />
        <ThemedTextInput
          placeholder='email'
          value={curState.email}
          onChangeText={handleTextChange('email')}
        />
        <ThemedTextInput
          placeholder='password'
          value={curState.password}
          onChangeText={handleTextChange('password')}
        />
        <ThemedTextInput
          placeholder='confirm password'
          value={curState.confirmPassword}
          onChangeText={handleTextChange('confirmPassword')}
        />
        <ThemedTextInput
          placeholder='phone number'
          value={curState.phoneNumber}
          onChangeText={handleTextChange('phoneNumber')}
        />
        <RadioButtonGroup
          titles={['Male', 'Female']}
          onSelect={handleTextChange('gender')}
        />
        <RadioButtonGroup
          titles={[Permission.Parent, Permission.Student, Permission.Tutor]}
          onSelect={handleTextChange('userType')}
        />
      </CenteredDiv>
      <ButtonGroupContain>
        <ButtonContainer>
          <ThemedButton
            buttonText='Add another member'
            loading={false}
            onPress={addMember}
          />
        </ButtonContainer>

        <ButtonContainer>
          <ThemedButton
            buttonText='Submit'
            loading={false}
            onPress={GoToConf}
          />
        </ButtonContainer>
      </ButtonGroupContain>
    </View>
  )
}

export default CreateUser;
