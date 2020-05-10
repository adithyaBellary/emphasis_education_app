import React, { useState } from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components';
import { MD5 } from "crypto-js"
import gql from 'graphql-tag';

import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText
} from './shared';

import Test_s from './test_s';

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
    login(email: $email, password: $password) {
      res
      chatIDs
    }
  }
`;

const Login: React.FC<ILoginProps> = props => {

  const [curState, setState] = useState({
    error: false,
    userName: 'test01@gmail.com',
    email: 'test01@gmail.com',
    password: 'test01',
    name: 'Test User'
  })

  const [doLogin, { error }] = useMutation(
    LOGIN,
    {
      variables: {
        email: curState.email,
        password: curState.password
      },
      onCompleted: ( {login} ) => {
        if (login.res) {
          successLogin(login.chatIDs)
        } else {
          errorLogin()
        }
      }
    }
  )

  if (error) console.log('ERROR');

  const onChangeEmail = (email: string) => setState({
    ...curState,
    email
  });
  const onChangePassword = (password: string) => setState({
    ...curState,
    password
  });

  const getHash = (email: string): string => {
    return MD5(email).toString();
  }

  const successLogin = (chatIDs: [string]) => {
    // console.log('the current state')
    // console.log(curState)
    props.navigation.navigate(
      'Home',
      {
        name: curState.name,
        email: curState.email,
        _id: getHash(curState.email),
        chatIDs,
      }
    );
  }

  const errorLogin = () => {
    setState({
      ...curState,
      error: true
    })
  }

  const my_login = () => {
    doLogin({
      variables: {
        email: curState.email,
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
          value={curState.email}
          onChangeText={onChangeEmail}
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
        <ButtonContainer>
          <MyButton
            onPress={() => Alert.alert('run forgot password')}
            >
            <MyButtonText>Forgot Password?</MyButtonText>
          </MyButton>
        </ButtonContainer>
        <Test_s />
      </CenteredDiv>
    </PositionDiv>
  </SafeAreaView>

    )
  }

export default Login;