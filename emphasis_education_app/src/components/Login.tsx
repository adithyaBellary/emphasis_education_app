import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import styled from 'styled-components';
import { MD5 } from 'crypto-js';

import {
  ButtonContainer,
  CenteredDiv,
  LoginInput,
  HorizontalDivider,
  ThemedButton
} from './shared';
import Context, { AuthContext } from './Context/Context';

import {
  IconRow,
  VerticalDivider,
  ThemedText,
  GeneralSpacing,
  FONT_STYLES
} from './shared';
import { LogoWithText } from './Logo/LogoWithText';

const PositionDiv = styled(View)`
  padding-top: 200px;
`;

interface ILoginProps {
  navigation: any;
  route: any;
  error: boolean;
  loading: boolean;
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
  onPress(): void;
}

const SecondaryLink: React.FC<ISecondaryLinkProps> = ({ linkContent, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={0} r={10} d={0} l={10}>
      <ThemedText size={14} type={FONT_STYLES.LIGHT}>
        {linkContent}
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
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

  const changeScreens = (loc: string) => () => props.navigation.navigate(loc)

  return (
    <ContentWrap>
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
        <ThemedButton
          buttonText='Login'
          loading={props.loading}
          onPress={() => login(curState.email, curState.password)}
        />
      </ButtonContainer>

      <IconRow>
        <SecondaryLink linkContent={'First time user?'} onPress={changeScreens('EnterCode')} />
        <VerticalDivider height={10}/>
        <SecondaryLink linkContent={'Forgot Password'} onPress={changeScreens('CreateUserContain')} />
      </IconRow>
    </ContentWrap>
  )
}

export default Login;