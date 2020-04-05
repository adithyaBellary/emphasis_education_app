import React from 'react';

import fireBaseSvc from '../service/FireBaseSvc';

import {
  Alert,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput
} from 'react-native';

import styled from 'styled-components';

import { userType } from '../types/userType';

import Test_q from './test_q';

const MyButton = styled(TouchableOpacity)`
  background-color: lightskyblue;
  width: 100px;
  height: 20px;
`;

const MyButtonText = styled(Text)`
  color: white;
  text-align: center;
  font-size: 12px;
`;

const CenteredDiv = styled(View)`
  align-items: center;
`;

const PositionDiv = styled(View)`
  padding-top: 200px;
`;

const ButtonContainer = styled(View)`
  padding: 10px;
`;

const TitleText = styled(Text)`
  font-size: 20px;
`;

const TitleContain = styled(View)`
  padding-top: 200px;
`;

const MytextInput = styled(TextInput)`
  border: black;
  padding: 10px;
`;

interface ILoginProps {
  // TODO type this shit
  navigation: any;
}

interface ILoginState {
  error: boolean;
  userName: string;
  email: string;
  password: string;
}

const ErrorText = styled(Text)`
  color: red;
  font-size: 16px;
`;

const Errorlogin: React.FC = () => (
  <ErrorText>there was an issue logging in</ErrorText>
);

class Login extends React.Component<ILoginProps, ILoginState> {

  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      error: false,
      userName: 'test01@gmail.com',
      email: 'test_email@gmail.com',
      password: 'test01'
    }
  }

  onChangeUsername = (userName: string) => this.setState({ userName });
  onChangePassword = (password: string) => this.setState({ password });

  successLogin = () => {
    console.log('log in was successful');
    this.props.navigation.navigate(
      'Chat',
      // need to pass in props to the chat screen
      {
        name: this.state.userName,
        email: this.state.email
      }
    );
  }

  errorLogin = () => {
    console.log('there was an issue logging in');
    this.setState({ error: true })
  }

  // login with firebase
  my_login = async () => {
    console.log('we are logging in rn');
    // need to add more fields prob
    const user: userType = {
      email: this.state.userName,
      password: this.state.password
    }

    const resp = fireBaseSvc.login(
      user,
      this.successLogin,
      this.errorLogin
    )
  }

  public render () {
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
          value={this.state.userName}
          onChangeText={this.onChangeUsername}
        />
        <MytextInput
          placeholder='password'
          value={this.state.password}
          onChangeText={this.onChangePassword}
        />
        {this.state.error &&
          <Errorlogin />
        }
        <ButtonContainer>
          <MyButton
            // onPress={() => Alert.alert('run auth')}
            onPress={this.my_login}
            >
            <MyButtonText>Login</MyButtonText>
          </MyButton>
        </ButtonContainer>
        <ButtonContainer>
          <MyButton
            onPress={() => Alert.alert('go to enter the code')}
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
        <Test_q />
        {/* <Text>
          {Test_q(}
        </Text> */}
        <ButtonContainer>
          <MyButton
            // onPress={() => Alert.alert('take me home')}
            // this is how we can navigate
            onPress={() => this.props.navigation.navigate('Chat')}
            >
            <MyButtonText>go to the chat</MyButtonText>
          </MyButton>
        </ButtonContainer>
      </CenteredDiv>
    </PositionDiv>
  </SafeAreaView>

    )
  }
};

export default Login;