import React, { useState, useContext } from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image
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

import { IconRow, VerticalDivier, ThemedText, GeneralSpacing } from './shared';
import { LogoWithText } from './Logo/LogoWithText';

const PositionDiv = styled(View)`
  padding-top: 200px;
`;

// const TitleText = styled(Text)`
//   font-size: 20px;
//   fontFamily: ${({ theme }) => theme.font.main};
// `;

// const TitleContain = styled(View)`
//   padding-top: 100px;
// `;

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
interface ISecondaryLinkProps {
  linkContent: string;
}

const SecondaryLink: React.FC<ISecondaryLinkProps> = ({ linkContent }) => (
  <GeneralSpacing u={0} r={10} d={0} l={10}>
    <TouchableOpacity onPress={() => console.log('clicked')}>
      <ThemedText size={14} type={'light'}>
        {linkContent}
      </ThemedText>
    </TouchableOpacity>
  </GeneralSpacing>
);

const LoginImage = () => (
  <GeneralSpacing u={0} r={0} d={50} l={0} >
    <Image
      source={{ uri: LogoWithText}}
      style={{
        height: 300,
        width: 400
      }}
    />
  </GeneralSpacing>
)

const ContentWrap: React.FC = ({ children }) => (
  <SafeAreaView>
    <CenteredDiv>
      {children}
    </CenteredDiv>
  </SafeAreaView>
);


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
      <CenteredDiv>
        <LoginImage />

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

        <IconRow>
          <SecondaryLink linkContent={'Fist time user?'}/>
          <VerticalDivier height={10}/>
          <SecondaryLink linkContent={'Forgot Password'}/>
        </IconRow>

        </CenteredDiv>
    </SafeAreaView>
    )
  }

export default Login;