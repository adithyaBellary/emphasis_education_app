import * as React from 'react';
import { useMutation } from '@apollo/client';
import {
  Alert,
  View,
  ScrollView
} from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

import { IUserInput, IUsableUserInfo, GenericResponse, Permission } from '../../types';
// import CreateUser from './CreateUser';
import { CREATE_USER } from '../../queries/CreateUser';
import { theme } from '../../theme'

// import  ConfirmationScreen  from './ConfirmationScreen';

import {
  CenteredDiv,
  ButtonContainer,
  // RadioButtonGroup,
  // ThemedTextInput,
  ThemedButton,
  IconRow,
  GeneralSpacing,
  ThemedText,
  FONT_STYLES,
  // ThemedNumberInput
} from '../shared';

interface CreateUserContainProps {
  navigation: any;
  route: any;
}
const SuccessMessaging: string = 'Thank you for joining Emphasis Education!';
const ErrorMessaging: string = 'There was an issue creating this user';


export interface IFormData {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  dob: string,
  phoneNumber: string,
  // userType: Permission
}
export interface CreateUserArr {
  users: IUserInput[];
}

const CreateUserContain: React.FC<CreateUserContainProps> = props => {
  const [userInfo, setUserInfo] = React.useState<CreateUserArr>({users: []});
  const [showConf, setShowConf] = React.useState(false);
  const [submitDisabled, setSubmitDisabled] = React.useState(false);
  const [numUser, setNumUser] = React.useState<number>(1)
  const [currentUser, setCurrentUser] = React.useState<IUserInput>();
  const [picker, setPicker] = React.useState<Permission>(Permission.Student)
  const [editing, setEditing] = React.useState<boolean>(false);

  const { control, handleSubmit, watch, errors, reset, formState, setValue } = useForm<IFormData>();

  React.useEffect(() => {
    if (showConf) {
      props.navigation.setOptions({
        title: 'Create User Confirmation'
      })
    } else {
      props.navigation.setOptions({
        title: 'Create User'
      })
    }
  }, [showConf])

  React.useEffect(() => {
    if (userInfo && userInfo.users.length > 0) {
      console.log('num user in useEfec', numUser)
      console.log('userInfo in useeffect', userInfo?.users)
      setValue('firstName', userInfo?.users[0].firstName)
      setValue('lastName', userInfo?.users[0].lastName)
      setValue('email', userInfo?.users[0].email)
      setValue('password', userInfo?.users[0].password)
      setValue('confirmPassword', '')
      setValue('phoneNumber', userInfo?.users[0].phoneNumber)
      setValue('dob', userInfo?.users[0].dob)
      setPicker(userInfo?.users[0].userType as Permission)
    }
    if (numUser !== userInfo?.users.length - 1) {
      setEditing(true)
    } else {
      setEditing(false)
    }
  }, [numUser])

  // make this into our own custom hook
  const updateUserInfo = (newUserInfo: IUserInput): void => {
    setNumUser(numUser + 1)
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

  const addMember = (formData: IFormData)  => {
    // console.log('formData', formData)
    // console.log('user type', picker)
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    // saveUserInfo(u);
    setNumUser(numUser + 1)
    updateUserInfo(u)
    reset()
    setPicker(Permission.Student)
  }

  const handleGoBack = (formData: IFormData) => {
    // const {dirtyFields} = formState;
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    console.log('u in go back', u)
    // saveUserInfo(u);
    // reset();
    // goToPreviousUser();
    setNumUser(numUser - 1)
  }

  const handleGoForward = (formData: IFormData) => {
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    updateUserInfo(u)
    reset();
    goToNextUser();
  }

  const handlePhoneNumberInput = (number: string): string => {
    const justNumbers: string = number.replace(/[^0-9]/g, '')
    if (justNumbers.length > 3 && justNumbers.length <= 6) {
      return `${justNumbers.slice(0,3)}-${justNumbers.slice(3)}`
    } else if (justNumbers.length > 6) {
      return `${justNumbers.slice(0,3)}-${justNumbers.slice(3,6)}-${justNumbers.slice(6)}`
    } else {
      return justNumbers
    }
  }

  const handleDOBInput = (DOB: string): string => {
    const justNumbers: string = DOB.replace(/[^0-9]/g, '');
    if (justNumbers.length > 2 && justNumbers.length <= 4) {
      return `${justNumbers.slice(0,2)}/${justNumbers.slice(2)}`
    } else if (justNumbers.length > 4) {
      return `${justNumbers.slice(0,2)}/${justNumbers.slice(2,4)}/${justNumbers.slice(4)}`
    } else {
      return justNumbers
    }
  }

  // console.log('userInfo', userInfo)

  const goToPreviousUser = () => {
    console.log('gong to previous user')
    const newNum = numUser - 1
    setNumUser(newNum)
    setCurrentUser(userInfo?.users[newNum-1])
  }

  const goToNextUser = () => {
    setNumUser(numUser + 1)
    setCurrentUser(userInfo?.users[numUser])
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

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const onlyLettersRe = /[^a-z]+/gi

  const watchPassword = watch('password')

  return (
    <ScrollView>
      <CenteredDiv>
        <ThemedText size={14} type={FONT_STYLES.LIGHT}>Family Member Number {numUser}</ThemedText>
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='First Name'
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              // inputStyle={{
              //   paddingTop: 10
              // }}
              // label={'First Name'}
              value={value}
              errorMessage={errors.firstName?.message}
            />
          )}
          name='firstName'
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              onlyLetters: value => onlyLettersRe.test(value) ? 'First name must only contain letters' : true
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
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              onlyLetters: value => onlyLettersRe.test(value) ? 'Last name must only contain letters' : true
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
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              emailPattern: value => re.test(value) ? true : 'Email is not properly formatted'
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
              secureTextEntry={true}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
          name='password'
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              minLength: value => value.trim().length < 6 ? 'Password must be at least 6 characters long' : true
            }
          }}
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
              secureTextEntry={true}
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
          name='confirmPassword'
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              matches: value => value.trim() !== watchPassword.trim() ? 'Must match password field' : true
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Enter Phone Number (###-###-####)'
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
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              length: value => value.trim().length === 12 ? true : 'Phone number must follow the ###-###-#### format'
            }
          }}
        />
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              placeholder='Enter DOB (MM/DD/YYYY)'
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
          defaultValue={''}
          rules={{
            required: 'This field is required',
            validate: {
              length: value => value.trim().length === 10 ? true : 'DOB must follow the MM/DD/YYYY format'
            }
          }}
        />
        <View
          style={{
            zIndex: 1000,
            alignItems: 'center'
          }}
        >
          <ThemedText
            size={16}
            type={FONT_STYLES.MAIN}
          >
            Select the User Type
          </ThemedText>
          <Picker
            selectedValue={picker}
            style={{width: 120}}
            itemStyle={{
              height: 120,
              fontFamily: theme.font.main
            }}
            onValueChange={(itemValue, itemIndex) => {
              setPicker(itemValue as Permission)
              // onChange(itemValue as string)
            }
            }>
            <Picker.Item label={Permission.Student} value={Permission.Student} />
            <Picker.Item label={Permission.Guardian} value={Permission.Guardian} />
            <Picker.Item label={Permission.Tutor} value={Permission.Tutor} />
          </Picker>
        </View>

      </CenteredDiv>

      <GeneralSpacing u={50} r={0} d={0} l={0}>
        <IconRow>
          <ButtonContainer>
            <ThemedButton
              buttonText='Previous user'
              loading={false}
              onPress={handleSubmit(handleGoBack)}
              disabled={numUser === 0}
            />
          </ButtonContainer>
          <ButtonContainer>
            {editing ? (
              <ThemedButton
                buttonText='Next User'
                loading={false}
                onPress={handleSubmit(handleGoForward)}
                disabled={numUser === (userInfo?.users?.length)}
              />
            ) : (
              <ThemedButton
                buttonText='dummy'
                loading={false}
                onPress={handleSubmit(handleGoForward)}
                disabled={numUser === (userInfo?.users?.length)}
              />
            )}

          </ButtonContainer>
        </IconRow>
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
              onPress={() => console.log('surprise')}
              // disabled={!canSubmit()}
            />
          </ButtonContainer>
        </IconRow>
      </GeneralSpacing>
    </ScrollView>
  )
}

export default CreateUserContain;
