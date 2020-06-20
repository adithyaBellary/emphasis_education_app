import React, { useState } from 'react';
import {
  View,
  Text
} from 'react-native'
import { Input } from 'react-native-elements';

import { IUserInput, Permission } from '../types';
import {
  CenteredDiv,
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText,
  RadioButtonGroup
} from './shared';
import styled from 'styled-components';

const InputContain = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: black;
  width: 90%;
`

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
    gender: 'F'
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
      <Text>this is fam member number: {numUser}</Text>
      <CenteredDiv>
        <InputContain>
          <MytextInput
            placeholder='name'
            value={curState.name}
            onChangeText={handleTextChange('name')}
          />
        </InputContain>
      </CenteredDiv>
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
      <ButtonContainer>
        <MyButton
          onPress={addMember}
          // disabled={true}
        >
          <MyButtonText>
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
