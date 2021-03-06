import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import FastImage from 'react-native-fast-image'
import styled from 'styled-components';

import { theme } from '../theme';
import {
  LogoWithTextEncoded
} from '../images/base64'

import {
  ButtonContainer,
  CenteredDiv,
  LoginInput,
  HorizontalDivider,
  ThemedButton
} from './shared';
import { AuthContext } from './Context/Context';
import {
  IconRow,
  VerticalDivider,
  ThemedText,
  GeneralSpacing,
  FONT_STYLES
} from './shared';

const ErrorText = styled(Text)`
  color: red;
  font-size: 16px;
`;

const Errorlogin: React.FC = () => (
  <ErrorText>there was an issue logging in</ErrorText>
);

const InputContain = styled(View)`
  padding: 10px;
`
interface SecondaryLinkProps {
  linkContent: string;
  onPress(): void;
}

const SecondaryLink: React.FC<SecondaryLinkProps> = ({ linkContent, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={0} r={10} d={0} l={10}>
      <ThemedText size={14} type={FONT_STYLES.LIGHT}>
        {linkContent}
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
);

const LoginImage = () => (
  <GeneralSpacing u={0} r={0} d={50} l={0}>
    <Image
      source={{
        uri: LogoWithTextEncoded
      }}
      style={{
        height: 300,
        width: 400,
      }}
    />
  </GeneralSpacing>
)

const ContentWrap: React.FC = ({ children }) => (
  <SafeAreaView>
    <ScrollView>
      <CenteredDiv>
        {children}
      </CenteredDiv>
    </ScrollView>
  </SafeAreaView>
);

interface LoginProps {
  error: boolean;
  loading: boolean;
  navigation: any;
  route: any;
}

const Login: React.FC<LoginProps> = ({ error, loading, navigation }) => {

  const { login } = useContext(AuthContext);

  const [curState, setState] = useState({
    error: false,
    userName: '',
    email: '',
    password: '',
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

  const changeScreens = (loc: string) => () => navigation.navigate(loc)

  return (
    <ContentWrap>
      <LoginImage />

      <InputContain>
        <LoginInput
          placeholder='Username'
          placeholderTextColor={theme.colors.purple}
          value={curState.email}
          onChangeText={onChangeEmail}
          style={{
            color: theme.colors.purple
          }}
        />
      </InputContain>

      <HorizontalDivider width={60} color={theme.colors.purple}/>

      <InputContain>
        <LoginInput
          placeholder='Password'
          placeholderTextColor={theme.colors.purple}
          value={curState.password}
          secureTextEntry={true}
          onChangeText={onChangePassword}
          style={{
            color: theme.colors.purple,
            fontFamily: theme.font.main
          }}
        />
      </InputContain>

      {error && <Errorlogin /> }

      <ButtonContainer>
        <ThemedButton
          buttonText='Login'
          loading={loading}
          onPress={() => login(curState.email, curState.password)}
        />
      </ButtonContainer>

      <IconRow>
        <SecondaryLink linkContent={'First time user?'} onPress={changeScreens('EnterCode')} />
        <VerticalDivider height={10}/>
        <SecondaryLink linkContent={'Forgot Password'} onPress={changeScreens('ForgotPassword')} />
      </IconRow>
    </ContentWrap>
  )
}

export default Login;