import React from 'react';

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import styled from 'styled-components';

const MyButton = styled(TouchableOpacity)`
  background-color: grey;
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
  padding-top: 400px;
`;

const ButtonContainer = styled(View)`
  padding: 10px;
`;

const Login = () => (
  <SafeAreaView>
    <PositionDiv>
      <CenteredDiv>
        <ButtonContainer>
          <MyButton
            onPress={() => alert('run auth')}
            >
            <MyButtonText>Login</MyButtonText>
          </MyButton>
        </ButtonContainer>
        <ButtonContainer>
          <MyButton
            onPress={() => alert('go to enter the code')}
            >
            <MyButtonText>First time user?</MyButtonText>
          </MyButton>
        </ButtonContainer>
      </CenteredDiv>
    </PositionDiv>
  </SafeAreaView>
);

export default Login;