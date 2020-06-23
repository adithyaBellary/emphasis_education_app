import React, { useState, useContext } from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components';
import { MD5 } from "crypto-js"

import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText,
  CenteredDiv,
  LoginInput
} from './shared';
import { LOGIN } from '../queries/Login';
import Context from './Context/Context';
import { Permission, ILoginPayload, ILoginPayloadProps } from '../types';

const PositionDiv = styled(View)`
  padding-top: 200px;
`;

const TitleText = styled(Text)`
  font-size: 20px;
  fontFamily: ${({ theme }) => theme.font.main};
`;

const TitleContain = styled(View)`
  padding-top: 100px;
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

const getHash = (email: string): string => {
  return MD5(email).toString();
}

const Login: React.FC<ILoginProps> = props => {

  React.useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => null
    })
  }, [])

  const { setUser } = useContext(Context);

  const [curState, setState] = useState({
    error: false,
    userName: 'test01@gmail.com',
    email: 'test01@gmail.com',
    password: 'test01',
    name: 'Test User'
  })

  // TODO use loading state to render spinner
  const [doLogin, { data, error, loading }] = useMutation<ILoginPayload>(
    LOGIN,
    {
      variables: {
        email: curState.email,
        password: curState.password
      },
      onCompleted: ( { login } ) => {
        console.log('login result', login.user)
        if (login.res) {
          successLogin(login)
        } else {
          errorLogin()
        }
      }
    }
  )

  if (error) console.log('ERROR', error);

  const onChangeEmail = (email: string) => setState({
    ...curState,
    email
  });
  const onChangePassword = (password: string) => setState({
    ...curState,
    password
  });

  const successLogin = (user: ILoginPayloadProps) => {
    console.log('login user', user.user)
    setUser({...user.user})
    props.navigation.navigate('Home');
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
          <LoginInput
            placeholder='username'
            value={curState.email}
            onChangeText={onChangeEmail}
          />
          <LoginInput
            placeholder='password'
            value={curState.password}
            onChangeText={onChangePassword}
          />
          {curState.error && <Errorlogin /> }
          <ButtonContainer>
            <MyButton
              onPress={my_login}
            >
              <MyButtonText>Login</MyButtonText>
            </MyButton>
          </ButtonContainer>
          <ButtonContainer>
            <MyButton
              onPress={() => props.navigation.navigate('CreateUserContain')}
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
        </CenteredDiv>
      </PositionDiv>
    </SafeAreaView>
    )
  }

export default Login;