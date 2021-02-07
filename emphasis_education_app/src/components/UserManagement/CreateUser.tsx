import React, { useState } from 'react';
import { ScrollView, View } from 'react-native'
import { Input } from 'react-native-elements';
import { useForm, Controller } from "react-hook-form";

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
  dob: ''
}

const CreateUser: React.FC<CreateUser> = props => {
  const [numUser, setNumUser] = React.useState<number>(1)
  const [curState, setState] = useState<IUserInput>({} as IUserInput);

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const onlyLettersRe = /[^a-z]+/gi

  const handleTextChange = (name: string) => (text: string) => setState({...curState, [name]: text})
  const clearData = () => setState(EmptyData);
  const checkPassword = (): boolean => curState.password === curState.confirmPassword
  const checkPhoneNumber = (): boolean => curState.phoneNumber.length === 12
  const checkdob = (): boolean => curState.dob.length === 10
  const checkEmail = (): boolean => re.test(curState.email)

  const { control, handleSubmit, watch, errors } = useForm<{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    dob: string,
    phoneNumber: string,
  }>();

  const watchPassword = watch('password')

  const canSubmit = (): boolean => {
    return (
      !!curState.firstName &&
      !!curState.lastName &&
      !!curState.email &&
      !!curState.password &&
      !!curState.confirmPassword &&
      !!curState.phoneNumber &&
      !!curState.userType &&
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

  const addMember = d => {
    console.log('d', d)
    // props.saveUserInfo(curState);
    // setNumUser(numUser + 1);
    // clearData();
  }

  const handlePhoneNumberInput = (number: string): string => {
    const justNumbers: string = number.replace(/[^0-9]/g, '')
    if (justNumbers.length > 3 && justNumbers.length <= 6) {
      // setState({ ...curState, 'phoneNumber': `${justNumbers.slice(0,3)}-${justNumbers.slice(3)}` })
      return `${justNumbers.slice(0,3)}-${justNumbers.slice(3)}`
    } else if (justNumbers.length > 6) {
      // setState({ ...curState, 'phoneNumber': `${justNumbers.slice(0,3)}-${justNumbers.slice(3,6)}-${justNumbers.slice(6)}`})
      return `${justNumbers.slice(0,3)}-${justNumbers.slice(3,6)}-${justNumbers.slice(6)}`
    } else {
      // setState({ ...curState, 'phoneNumber': justNumbers})
      return justNumbers
    }
  }

  const handleDOBInput = (DOB: string): string => {
    const justNumbers: string = DOB.replace(/[^0-9]/g, '');
    if (justNumbers.length > 2 && justNumbers.length <= 4) {
      // setState({ ...curState, 'dob': `${justNumbers.slice(0,2)}/${justNumbers.slice(2)}`})
      return `${justNumbers.slice(0,2)}/${justNumbers.slice(2)}`
    } else if (justNumbers.length > 4) {
      // setState({ ...curState, 'dob': `${justNumbers.slice(0,2)}/${justNumbers.slice(2,4)}/${justNumbers.slice(4)}`})
      return `${justNumbers.slice(0,2)}/${justNumbers.slice(2,4)}/${justNumbers.slice(4)}`
    } else {
      // setState({ ...curState, 'dob': justNumbers})
      return justNumbers
    }
  }

  return (
    <ScrollView>
      <CenteredDiv>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>Family Member Number {numUser}</ThemedText>
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='First Name'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              errorMessage={errors.firstName?.message}
            />
          )}
          name='firstName'
          defaultValue=''
          rules={{
            required: 'This field is required',
            validate: {
              onlyLetters: value => onlyLettersRe.test(value) ? 'only letters in your name' : ''
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Last Name'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              errorMessage={errors.lastName?.message}
            />
          )}
          name='lastName'
          defaultValue=''
          rules={{
            required: 'This field is required',
            validate: {
              onlyLetters: value => onlyLettersRe.test(value) ? 'only letters in your name' : ''
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Email'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
          name='email'
          defaultValue=''
          rules={{
            required: 'This field is required',
            validate: {
              emailPattern: value => re.test(value) ? '' : 'email not properly formatted'
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Password'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
          name='password'
          defaultValue=''
          rules={{ required: 'This field is required'}}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Confirm Password'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
          name='confirmPassword'
          defaultValue=''
          rules={{
            required: 'This field is required',
            validate: {
              matches: value => value !== watchPassword ? 'Must match password field' : ''
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Enter Phone Number (###) ###-####'
              containerStyle={{
                width: '95%',
              }}
              onChangeText={number => onChange(handlePhoneNumberInput(number))}
              maxLength={12}
              value={value}
              errorMessage={errors.phoneNumber?.message}
            />
          )}
          name='phoneNumber'
          defaultValue=''
          rules={{ required: 'This field is required'}}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Enter DOB MM/DD/YYYY'
              containerStyle={{
                width: '95%',
              }}
              onChangeText={number => onChange(handleDOBInput(number))}
              value={value}
              maxLength={10}
              errorMessage={errors.dob?.message}
            />
          )}
          name='dob'
          defaultValue=''
          rules={{ required: 'This field is required'}}
        />
        {/* <RadioButtonGroup
          titles={[Permission.Guardian, Permission.Student, Permission.Tutor]}
          onSelect={handleTextChange('userType')}
        /> */}
      </CenteredDiv>

      <GeneralSpacing u={60} r={0} d={0} l={0}>
        <IconRow>
          <ButtonContainer>
            <ThemedButton
              buttonText='Add another member'
              loading={false}
              onPress={handleSubmit(addMember)}
              // disabled={!canSubmit()}
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
