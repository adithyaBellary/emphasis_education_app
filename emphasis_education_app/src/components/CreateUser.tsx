import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  View, Alert,
} from 'react-native'

import {
  MytextInput, ButtonContainer, MyButton, MyButtonText,

} from './shared';

const CREATE_USER = gql`
  mutation createUser($email: String!, $password: String!, $userType: Permission!) {
    createUser(email: $email, password: $password, userType: $userType)
  }
`;

const SUB = gql`
  subscription somethingChanged($test: String) {
    somethingChanged(test: $test)
  }
`

const CreateUser: React.FC = () => {

  const [curState, setState] = useState({
    name: 'test name',
    email: 'test01@gmail.com',
    password: 'test01',
    confirmPassword: 'test01',
    phone_number: '',
    userType: 'Student',
    classes: 'Math'
  });

  // TODO generalize input handler functions
  const onNameChange = (name: string) => setState({ ...curState, name });
  const onEmailChange = (email: string) => setState({ ...curState, email });
  const onPasswordChange = (password: string) => setState({ ...curState, password });
  const onPasswordConfirmChange= (confirmPassword: string) => setState({ ...curState, confirmPassword });
  const onClassChange = (classes: string) => setState({ ...curState, classes });
  const onTypeChange = (userType: string) => setState({ ...curState, userType });

  const [createUserMut, { loading, error }] = useMutation(
    CREATE_USER,
    {
      onCompleted: () => {
        console.log('we gucci');
        Alert.alert('Thank you for joining Emphasis Education');
      }
    }
  )

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

  return (
    <View>
      <MytextInput
        placeholder='name'
        value={curState.name}
        onChangeText={onNameChange}
      />
      <MytextInput
        placeholder='email'
        value={curState.email}
        onChangeText={onEmailChange}
      />
      <MytextInput
        placeholder='password'
        value={curState.password}
        onChangeText={onPasswordChange}
      />
      <MytextInput
        placeholder='confirm password'
        value={curState.confirmPassword}
        onChangeText={onPasswordConfirmChange}
      />
      <MytextInput
        placeholder='user type'
        value={curState.userType}
        onChangeText={onTypeChange}
      />
      <MytextInput
        placeholder='classes'
        value={curState.classes}
        onChangeText={onClassChange}
      />

      <ButtonContainer>
        <MyButton
          onPress={createUser}
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
