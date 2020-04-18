import React, { useState } from 'react';

import {useMutation} from '@apollo/react-hooks';
import {
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components';

import Test_q from './test_q';
import Test_s from './test_s';
import gql from 'graphql-tag';

import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText
} from './shared';

const CenteredDiv = styled(View)`
  align-items: center;
`;

const PositionDiv = styled(View)`
  padding-top: 200px;
`;

const TitleText = styled(Text)`
  font-size: 20px;
`;

const TitleContain = styled(View)`
  padding-top: 200px;
`;

interface ILoginProps {
  // TODO type this shit
  navigation: any;
}

const ErrorText = styled(Text)`
  color: red;
  font-size: 16px;
`;

const Errorlogin: React.FC = () => (
  <ErrorText>there was an issue logging in</ErrorText>
);

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const Login: React.FC<ILoginProps> = props => {

  const [curState, setState] = useState({
    error: false,
    userName: 'test01@gmail.com',
    email: 'test_email@gmail.com',
    password: 'test01',
    name: 'Test User'
  })

  const [doLogin, { loading, error }] = useMutation(
    LOGIN,
    {
      // props are going to be what is returned from the mutation
      onCompleted: ({ login }) => {
        console.log(login);
        login ? successLogin() : errorLogin()
      }
    }
  )

  if (error) console.log('ERROR');

  const onChangeUsername = (userName: string) => setState({
    ...curState,
    userName
  });
  const onChangePassword = (password: string) => setState({
    ...curState,
    password
  });

  const successLogin = () => {
    // console.log('log in was successful');
    props.navigation.navigate(
      'Chat',
      // need to pass in props to the chat screen
      {
        name: curState.name,
        email: curState.email
      }
    );
  }

  const errorLogin = () => {
    // console.log('there was an issue logging in');
    setState({
      ...curState,
      error: true
    })
  }

  const my_login = () => {
    // console.log('we are logging in rn');

    doLogin({
      variables: {
        email: curState.userName,
        password: curState.password,
      }
    })
  }
    return (
      <SafeAreaView>
    <TitleContain>
      <CenteredDiv>
        <TitleText>
          Emphasis Education App
        </TitleText>
      </CenteredDiv>
    </TitleContain>
    <PositionDiv>
      <CenteredDiv>
        <MytextInput
          placeholder='username'
          value={curState.userName}
          onChangeText={onChangeUsername}
        />
        <MytextInput
          placeholder='password'
          value={curState.password}
          onChangeText={onChangePassword}
        />
        {curState.error &&
          <Errorlogin />
        }
        <ButtonContainer>
          <MyButton
            onPress={my_login}
            >
            <MyButtonText>Login</MyButtonText>
          </MyButton>
        </ButtonContainer>
        <ButtonContainer>
          <MyButton
            onPress={() => props.navigation.navigate(
              'CreateUser'
            )}
            >
            <MyButtonText>First time user?</MyButtonText>
          </MyButton>
        </ButtonContainer>
        {/* <ButtonContainer>
          <MyButton
            onPress={() => Alert.alert('run forgot password')}
            >
            <MyButtonText>Forgot Password?</MyButtonText>
          </MyButton>
        </ButtonContainer> */}
        {/* <Test_q /> */}
        <Test_s />
        {/* <Text>
          {Test_q(}
        </Text> */}
        <ButtonContainer>
          <MyButton
            // onPress={() => Alert.alert('take me home')}
            // this is how we can navigate
            onPress={() => props.navigation.navigate('Chat')}
            >
            <MyButtonText>go to the chat</MyButtonText>
          </MyButton>
        </ButtonContainer>
      </CenteredDiv>
    </PositionDiv>
  </SafeAreaView>

    )
  }

export default Login;