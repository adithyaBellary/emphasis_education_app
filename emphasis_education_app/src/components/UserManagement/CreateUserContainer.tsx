import * as React from 'react';
import {
  Alert,
  View,
  ScrollView,
  Button
} from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { Icon, Input, Button as IconButton } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';

import { IUserInput, IUsableUserInfo, Permission } from '../../types';
import { theme } from '../../theme'
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

export interface IFormData {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  dob: string,
  phoneNumber: string,
}
export interface CreateUserArr {
  users: IUserInput[];
}

const EmptyUserForm: IFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  dob: ''
}

const CreateUserContain: React.FC<CreateUserContainProps> = ({ navigation }) => {
  const [picker, setPicker] = React.useState<Permission>(Permission.Student)
  const [userInfo, setUserInfo] = React.useState<CreateUserArr>({users: [{...EmptyUserForm, userType: Permission.Student}]});
  const [numUser, setNumUser] = React.useState<number>(0)
  const [saved, setSaved] = React.useState<boolean>(true);

  const { control, handleSubmit, watch, errors, setValue } = useForm<IFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dob: ''
    }
  });

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const onlyLettersRe = /[^a-z]+/gi

  // ugly, but does the job
  const watchFirstName = watch('firstName')
  const watchLastName = watch('lastName')
  const watchEmail = watch('email')
  const watchPhoneNumber = watch('phoneNumber')
  const watchDOB = watch('dob')
  const watchConfirmPassword = watch('confirmPassword')
  const watchPassword = watch('password')

  React.useEffect(() => {
    // console.log('we changed users', numUser)
    // console.log('the user we are setting', userInfo.users[numUser])

    setValue('firstName', userInfo.users[numUser].firstName)
    setValue('lastName', userInfo.users[numUser].lastName)
    setValue('email', userInfo.users[numUser].email)
    setValue('password', userInfo.users[numUser].password)
    setValue('confirmPassword', userInfo.users[numUser].confirmPassword)
    setValue('phoneNumber', userInfo.users[numUser].phoneNumber)
    setValue('dob', userInfo.users[numUser].dob)
    setPicker(userInfo.users[numUser].userType as Permission)

    // if (numUser === (userInfo.users.length)) {
    //   setEditing(false)
    // } else {
    //   setEditing(true)
    // }
    // setEditing(true)
    // setSaved(false)

  }, [numUser, userInfo]);

  React.useEffect(() => {
    setSaved(false)
  }, [
    watchFirstName,
    watchLastName,
    watchEmail,
    watchPassword,
    watchConfirmPassword,
    watchPhoneNumber,
    watchDOB,
    picker
  ])

  const handleClick = (formData: IFormData) => {
    console.log('calling handle click with ', userInfo)
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    console.log('current users', userInfo)
    if (!saved) {
      Alert.alert('Do not forget to save your user edits!')
    } else {
      const cleanUsers: IUsableUserInfo[] = userInfo.users.map(({confirmPassword, ...rest}) => rest )
      navigation.navigate('ConfirmationScreen', {users: cleanUsers})
    }
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title='Submit User(s)'
          onPress={handleSubmit(handleClick)}
        />
      )
    })
  })

  const handleSave = (formData: IFormData) => {
    const _index = numUser
    const newUsers = userInfo.users.reduce<IUserInput[]>((acc, cur, index) => {
      if (_index === index) {
        const u: IUserInput = {
          ...formData,
          userType: picker,
        }
        return [...acc, u]
      } else {
        return [...acc, cur]
      }
    }, [])
    console.log('new users', newUsers)

    setUserInfo({
      users: newUsers
    })
    setSaved(true)
  }

  const addMember = (formData: IFormData)  => {
    // console.log('formData', formData)
    // console.log('user type', picker)
    if (!saved) {
      console.log('NOT SAVED')
    }
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }


    // console.log('users', userInfo.users)
    const newUsers = userInfo.users.reduce<IUserInput[]>((acc, cur, index) => {
      if (numUser === index) {
        const u: IUserInput = {
          ...formData,
          userType: picker,
        }
        return [...acc, u]
      } else {
        return [...acc, cur]
      }
    }, [])
    console.log('new users', newUsers)
    // push a new empty user onto the stack)
    setUserInfo({users: [...newUsers, {...EmptyUserForm, userType: Permission.Student}]})
    setNumUser(userInfo.users.length)

  }

  const handleGoBack = (formData: IFormData) => {
    // const {dirtyFields} = formState;
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    console.log('u in go back', u)
    handleSave(u)
    setNumUser(numUser - 1)
  }

  const handleGoForward = (formData: IFormData) => {
    const u: IUserInput = {
      ...formData,
      userType: picker,
    }
    handleSave(u)
    setNumUser(numUser + 1)
  }

  const deleteMember = () => {

    userInfo.users.splice(numUser, 1)
    const newUsers = userInfo.users;
    if (numUser !== 0) {
      setNumUser(numUser - 1)
    }
    setUserInfo({users: newUsers});
  }

  const handleDeleteMember = () => {
    if (userInfo.users.length === 1) {
      // if we have only one user, we cannot delete it
      Alert.alert('Cannot delete this user as there is only one')
    } else {
      // if we have multiple, then confirm the action and then do it
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this user?',
        [
          {
            text: 'Delete',
            onPress: () => deleteMember()
          },
          {
            text: 'Cancel',
            onPress: () => console.log('canceled'),
            style: 'cancel'
          }
        ]
      )
    }
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




  return (
    <ScrollView>
      <CenteredDiv>
        <ThemedText size={14} type={FONT_STYLES.LIGHT}>Family Member Number {numUser + 1}</ThemedText>
        <Controller
          control={control}
          render={({ onChange, value}) => (
            <Input
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              label={'First Name'}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              label={'Last Name'}
              errorMessage={errors.lastName?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              value={value}
              label='Email'
              errorMessage={errors.email?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              secureTextEntry={true}
              value={value}
              label='Password'
              errorMessage={errors.password?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              onChangeText={value => onChange(value)}
              containerStyle={{
                width: '95%'
              }}
              secureTextEntry={true}
              value={value}
              label='Confirm Password'
              errorMessage={errors.confirmPassword?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              containerStyle={{
                width: '95%',
              }}
              onChangeText={number => onChange(handlePhoneNumberInput(number))}
              maxLength={12}
              value={value}
              label='Phone Number'
              errorMessage={errors.phoneNumber?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
              containerStyle={{
                width: '95%',
              }}
              onChangeText={number => onChange(handleDOBInput(number))}
              value={value}
              maxLength={10}
              label='Date of Birth'
              errorMessage={errors.dob?.message}
              labelStyle={{
                fontFamily: theme.font.main
              }}
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
            }
            }>
            <Picker.Item label={Permission.Student} value={Permission.Student} />
            <Picker.Item label={Permission.Guardian} value={Permission.Guardian} />
            <Picker.Item label={Permission.Tutor} value={Permission.Tutor} />
          </Picker>
        </View>

      </CenteredDiv>

      <GeneralSpacing u={35} r={0} d={0} l={0}>
        <IconRow>

          <IconButton
            title='Edit prev user'
            titleStyle={{
              fontFamily: theme.font.main,
              fontSize: 16
            }}
            icon={
              <Icon
                name='caretleft'
                type='antdesign'
                size={15}
                color='white'
              />
            }
            buttonStyle={{
              backgroundColor: theme.colors.purple,
              borderRadius: 10
            }}
            onPress={handleSubmit(handleGoBack)}
            disabled={numUser === 0}
          />
          <Icon
            name='close'
            type='antdesign'
            containerStyle={{
              paddingHorizontal: 12
            }}
            onPress={handleDeleteMember}
            size={30}
            color='grey'
          />

          <IconButton
            title='Edit next user'
            titleStyle={{
              fontFamily: theme.font.main,
              fontSize: 16
            }}
            iconRight={true}
            icon={
              <Icon
                name='caretright'
                type='antdesign'
                size={15}
                color='white'
              />
            }
            buttonStyle={{
              backgroundColor: theme.colors.purple,
              borderRadius: 10
            }}
            onPress={handleSubmit(handleGoForward)}
            disabled={numUser === (userInfo.users.length -1)}
          />
        </IconRow>
        <IconRow>
          <ButtonContainer>
            <ThemedButton
              buttonText='Add another user'
              loading={false}
              onPress={handleSubmit(addMember)}
            />
          </ButtonContainer>

          <ButtonContainer>
            <ThemedButton
              buttonText='Save edits?'
              loading={false}
              onPress={handleSubmit(handleSave)}
              disabled={saved}
            />
          </ButtonContainer>
        </IconRow>
      </GeneralSpacing>
    </ScrollView>
  )
}

export default CreateUserContain;
