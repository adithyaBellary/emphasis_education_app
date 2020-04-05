import React, { useState } from 'react';

// import fireBaseSvc from '../service/FireBaseSvc';
import {useMutation} from '@apollo/react-hooks';

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
import gql from 'graphql-tag';

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
  })

  const [doLogin, { loading, error }] = useMutation(
    LOGIN,
    {
      // props are going to be what is returned from the mutation
      onCompleted: (props) => console.log(props)
    }
  )

  if (error) console.log('ERROR');

  // console.log(data);

  const onChangeUsername = (userName: string) => setState({
    ...curState,
    userName
  });
  const onChangePassword = (password: string) => setState({
    ...curState,
    password
  });

  const successLogin = () => {
    console.log('log in was successful');
    props.navigation.navigate(
      'Chat',
      // need to pass in props to the chat screen
      {
        name: curState.userName,
        email: curState.email
      }
    );
  }

  const errorLogin = () => {
    console.log('there was an issue logging in');
    setState({
      ...curState,
      error: true
    })
  }

  // login with firebase
  const my_login = () => {
    console.log('we are logging in rn');
    // need to add more fields prob
    // const user: userType = {
    //   email: curState.userName,
    //   password: curState.password
    // }

    // const resp = fireBaseSvc.login(
    //   user,
    //   successLogin,
    //   errorLogin
    // )

    doLogin({
      variables: {
        email: curState.userName,
        password: curState.password,
        // success
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
            // onPress={() => doLogin({
            //   variables: {
            //     email: curState.email,
            //     password: curState.password
            //   }
            // })}
            onPress={my_login}
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