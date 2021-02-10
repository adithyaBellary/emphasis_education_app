import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native'

import { useForm, Controller } from "react-hook-form";


import { IUserInput, Permission } from '../../types';



import { IFormData } from './CreateUserContainer';

interface CreateUser {
  navigation: any;
  route: any;
  saveUserInfo(userInfo: IUserInput): void;
  goToNextUser(): void;
}

export interface CreateUserArr {
  users: IUserInput[];
}

const CreateUser: React.FC<CreateUser> = ({
  saveUserInfo,
  goToNextUser
}) => {
  // const [numUser, setNumUser] = React.useState<number>(1)


  // const [curUser, setCurUser] = React.useState<IUserInput>();
  const [numUser, setNumUser] = React.useState<number>(0)




  const { control, handleSubmit, watch, errors, reset, formState, setValue } = useForm<IFormData>();



  const updateUserInfo = (newUserInfo: IUserInput): void => {
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

  // if (errors) {
  //   console.log('errors', errors)
  // }

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

  const GoToConf = () => {
    // props.saveUserInfo(curState);
    // props.GoToConfirmationScreen()
    // reset()
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
    saveUserInfo(u);
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

  return (

  )
}

export default CreateUser;
