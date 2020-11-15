import React, { useState } from 'react';
import { ScrollView } from 'react-native'

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

interface CreateUser {
  navigation: any;
  route: any;
  GoToConfirmationScreen(): void;
  saveUserInfo(userInfo: IUserInput): void;
}

const EmptyData: IUserInput = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  userType: undefined,
  // gender: '',
  dob: ''
}

const CreateUser: React.FC<CreateUser> = props => {
  const [numUser, setNumUser] = React.useState<number>(1)

  const [curState, setState] = useState<IUserInput>({
    // firstName: 'test',
    // lastName: 'name',
    // email: 'test01@gmail.com',
    // password: 'test01',
    // confirmPassword: 'test01',
    // phoneNumber: '222-222-2222',
    // userType: Permission.Student,
    // gender: 'Male',
    // dob: '22/22/2222'
  } as IUserInput);

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleTextChange = (name: string) => (text: string) => setState({...curState, [name]: text})
  const clearData = () => setState(EmptyData);
  const checkPassword = (): boolean => curState.password === curState.confirmPassword
  const checkPhoneNumber = (): boolean => curState.phoneNumber.length === 12
  const checkdob = (): boolean => curState.dob.length === 10
  const checkEmail = (): boolean => re.test(curState.email)

  const canSubmit = (): boolean => {
    return (
      !!curState.firstName &&
      !!curState.lastName &&
      !!curState.email &&
      !!curState.password &&
      !!curState.confirmPassword &&
      !!curState.phoneNumber &&
      !!curState.userType &&
      // !!curState.gender &&
      !!curState.dob &&
      checkPassword() &&
      checkPhoneNumber() &&
      checkdob() &&
      checkEmail()
    )
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

  const handlePhoneNumberInput = (number: string) => {
    const justNumbers: string = number.replace(/[^0-9]/g, '')
    if (justNumbers.length > 3 && justNumbers.length <= 6) {
      setState({ ...curState, 'phoneNumber': `${justNumbers.slice(0,3)}-${justNumbers.slice(3)}` })
    } else if (justNumbers.length > 6) {
      setState({ ...curState, 'phoneNumber': `${justNumbers.slice(0,3)}-${justNumbers.slice(3,6)}-${justNumbers.slice(6)}`})
    } else {
      setState({ ...curState, 'phoneNumber': justNumbers})
    }
  }

  const handleDOBInput = (DOB: string) => {
    const justNumbers: string = DOB.replace(/[^0-9]/g, '');
    if (justNumbers.length > 2 && justNumbers.length <= 4) {
      setState({ ...curState, 'dob': `${justNumbers.slice(0,2)}/${justNumbers.slice(2)}`})
    } else if (justNumbers.length > 4) {
      setState({ ...curState, 'dob': `${justNumbers.slice(0,2)}/${justNumbers.slice(2,4)}/${justNumbers.slice(4)}`})
    } else {
      setState({ ...curState, 'dob': justNumbers})
    }
  }

  return (
    <ScrollView>
      <CenteredDiv>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>Family Member Number {numUser}</ThemedText>
        <ThemedTextInput
          placeholder='First Name'
          value={curState.firstName}
          onChangeText={handleTextChange('firstName')}
        />
        <ThemedTextInput
          placeholder='Last Name'
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
          secure={true}
          onChangeText={handleTextChange('password')}
        />
        <ThemedTextInput
          placeholder='Confirm Password'
          value={curState.confirmPassword}
          secure={true}
          onChangeText={handleTextChange('confirmPassword')}
        />
        <ThemedNumberInput
          placeholder='Enter Phone Number (###) ###-####'
          value={curState.phoneNumber}
          onChangeText={number => handlePhoneNumberInput(number)}
          maxLength={12}
        />
        <ThemedNumberInput
          placeholder='Enter DOB MM/DD/YYYY'
          value={curState.dob}
          onChangeText={number => handleDOBInput(number)}
          maxLength={10}
        />
        <RadioButtonGroup
          titles={[Permission.Guardian, Permission.Student, Permission.Tutor]}
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
              disabled={!canSubmit()}
            />
          </ButtonContainer>

          <ButtonContainer>
            <ThemedButton
              buttonText='Submit'
              loading={false}
              onPress={GoToConf}
              disabled={!canSubmit()}
            />
          </ButtonContainer>
        </IconRow>
      </GeneralSpacing>
    </ScrollView>
  )
}

export default CreateUser;
