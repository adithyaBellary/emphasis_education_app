import React from 'react';

import {
  Alert,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import styled from 'styled-components';

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

const Login = () => (
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
        <ButtonContainer>
          <MyButton
            onPress={() => Alert.alert('run auth')}
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
);

export default Login;