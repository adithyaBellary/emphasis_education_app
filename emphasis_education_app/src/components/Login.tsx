import React, { useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import styled from 'styled-components';
import { MD5 } from 'crypto-js';

import {
  MytextInput,
  ButtonContainer,
  MyButton,
  MyButtonText,
  CenteredDiv,
  LoginInput,
  HorizontalDivider
} from './shared';
import Context, { AuthContext } from './Context/Context';

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
  route: any;
  error: boolean;
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

const InputContain = styled(View)`
  padding: 10px;
`

const Login: React.FC<ILoginProps> = props => {

  const { login } = useContext(AuthContext);

  const [curState, setState] = useState({
    error: false,
    userName: 'test01@gmail.com',
    email: 'test01@gmail.com',
    password: 'test01',
    name: 'Test User'
  })

  const onChangeEmail = (email: string) => setState({
    ...curState,
    email
  });
  const onChangePassword = (password: string) => setState({
    ...curState,
    password
  });

  return (
    <SafeAreaView>
      <TitleContain>
        <CenteredDiv>
          <TitleText>
            Emphasis Education
          </TitleText>
        </CenteredDiv>
      </TitleContain>
      <PositionDiv>
        <CenteredDiv>
          <InputContain>
            <LoginInput
              placeholder='Username'
              value={curState.email}
              onChangeText={onChangeEmail}
            />
          </InputContain>
          <HorizontalDivider width={60}/>
          <InputContain>
            <LoginInput
              placeholder='Password'
              value={curState.password}
              onChangeText={onChangePassword}
            />
          </InputContain>
          {props.error && <Errorlogin /> }
          <ButtonContainer>
            <MyButton
              onPress={() => login(curState.email, curState.password)}
            >
              <MyButtonText>Login</MyButtonText>
            </MyButton>
          </ButtonContainer>
          <ButtonContainer>
            <MyButton
              onPress={() => props.navigation.push('CreateUserContain')}
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