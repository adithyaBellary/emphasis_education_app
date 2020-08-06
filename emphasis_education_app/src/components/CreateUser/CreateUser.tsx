import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput
} from 'react-native'

import { IUserInput, Permission } from '../../types';
import {
  CenteredDiv,
  ButtonContainer,
  RadioButtonGroup,
  ThemedTextInput,
  ThemedButton,
  IconRow,
  GeneralSpacing,
  ThemedText,
  FONT_STYLES,
  ThemedNumberInput
} from '../shared';

interface ICreateUser {
  navigation: any;
  route: any;
  GoToConfirmationScreen(): void;
  saveUserInfo(userInfo: IUserInput): void;
}

const EmptyData: IUserInput = {
  // name: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  userType: Permission.Student,
  gender: ''
}

const CreateUser: React.FC<ICreateUser> = props => {
  const [numUser, setNumUser] = React.useState<number>(1)
  const [numberInput, setNumberInput] = React.useState();
  const [DOB, SetDOB] = React.useState();

  const [curState, setState] = useState<IUserInput>({
    firstName: 'test',
    lastName: 'name',
    email: 'test01@gmail.com',
    password: 'test01',
    confirmPassword: 'test01',
    phoneNumber: '2',
    userType: Permission.Student,
    gender: ''
  });

  const handleTextChange = (name: string) => (text: string) => setState({...curState, [name]: text})
  const clearData = () => setState(EmptyData);

  // add this
  // const canSubmit = (): boolean => {
  //   return !!curState.name &&
  //    !!curState.phoneNumber
  // }

  const GoToConf = () => {
    props.saveUserInfo(curState);
    props.GoToConfirmationScreen()
  }

  const addMember = () => {
    props.saveUserInfo(curState);
    setNumUser(numUser + 1);
    clearData();
  }

  const handlePhoneNumberInput = (number: string) => {
    const justNumbers: string = number.replaceAll('-', '').replace('(', '').replace(')', '').replace(' ', '')
    if (justNumbers.length > 3 && justNumbers.length <= 6) {
      // add the first dash
      setNumberInput(`${justNumbers.slice(0,3)}-${justNumbers.slice(3)}`)
    } else if (justNumbers.length > 6) {
      setNumberInput(`${justNumbers.slice(0,3)}-${justNumbers.slice(3,6)}-${justNumbers.slice(6)}`)
    } else {
      setNumberInput(justNumbers)
    }
  }

  const handleDOBInput = (DOB: string) => {
    const justNumbers: string = DOB.replaceAll('/', '')
    console.log('just nums', justNumbers)
    if (justNumbers.length > 2 && justNumbers.length <= 4) {
      SetDOB(`${justNumbers.slice(0,2)}/${justNumbers.slice(2)}`)
    } else if (justNumbers.length > 4) {
      SetDOB(`${justNumbers.slice(0,2)}/${justNumbers.slice(2,4)}/${justNumbers.slice(4)}`)
    } else {
      SetDOB(justNumbers)
    }
  }

  return (
    <View>
      <CenteredDiv>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>Family Member Number {numUser}</ThemedText>
        <ThemedTextInput
          placeholder='Name'
          value={curState.firstName}
          onChangeText={handleTextChange('firstName')}
        />
        <ThemedTextInput
          placeholder='Name'
          value={curState.lastName}
          onChangeText={handleTextChange('lastName')}
        />
        <ThemedTextInput
          placeholder='Email'
          value={curState.email}
          onChangeText={handleTextChange('email')}
        />
        <ThemedTextInput
          placeholder='Password'
          value={curState.password}
          onChangeText={handleTextChange('password')}
        />
        <ThemedTextInput
          placeholder='Confirm Password'
          value={curState.confirmPassword}
          onChangeText={handleTextChange('confirmPassword')}
        />
        {/* <ThemedTextInput
          placeholder='Phone Number'
          value={curState.phoneNumber}
          onChangeText={handleTextChange('phoneNumber')}
        /> */}
        <ThemedNumberInput
          placeholder='Enter Phone Number (###) ###-####'
          value={numberInput}
          onChangeText={number => handlePhoneNumberInput(number)}
        />
        <ThemedNumberInput
          placeholder='Enter DOB MM/DD/YYYY'
          value={DOB}
          onChangeText={number => handleDOBInput(number)}
        />
        {/* <TextInput
          keyboardType='number-pad'
          placeholder='Enter Phone Number (###) ###-####'
          value={numberInput}
          onChangeText={number => handlePhoneNumberInput(number)}
          style={{
            fontSize: 20,
          }}
          maxLength={12}
        />
        <TextInput
          keyboardType='number-pad'
          placeholder='Enter DOB MM/DD/YYYY'
          value={DOB}
          onChangeText={number => handleDOBInput(number)}
          style={{
            fontSize: 20,
          }}
          maxLength={10}
        /> */}
        <RadioButtonGroup
          titles={['Male', 'Female']}
          onSelect={handleTextChange('gender')}
        />
        <RadioButtonGroup
          titles={[Permission.Parent, Permission.Student, Permission.Tutor]}
          onSelect={handleTextChange('userType')}
        />
      </CenteredDiv>

      <GeneralSpacing u={60} r={0} d={0} l={0}>
        <IconRow>
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
        </IconRow>
      </GeneralSpacing>
    </View>
  )
}

export default CreateUser;
