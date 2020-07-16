import * as React from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import {
  ButtonContainer,
  MyButton,
  MyButtonText,
  CenteredDiv,
  ContentContain,
  IconRow
} from '../shared';
import { ICreateUserArr } from './CreateUserContainer';
import IndividualItem from './DisplayIndividualMember';

import { IUserInput } from '../../types';

interface IConfirmationScreenProps {
  navigation: any;
  createdUsers: ICreateUserArr | undefined;
  loading: boolean;
  submit(): void;
}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<IConfirmationScreenProps> = ({ createdUsers, loading, submit, navigation }) => (
  <View>
    <ContentContain>
      {createdUsers && createdUsers.users.map((user: IUserInput, index: number) => (
        <IndividualItem
          id={index + 1}
          {...user}
        />
      ))}
    </ContentContain>
    <IconRow>
      <ButtonContainer>
        <MyButton onPress={submit}>
          <MyButtonText>
            Submit
          </MyButtonText>
          {loading && <ActivityIndicator/>}
        </MyButton>
      </ButtonContainer>
      <ButtonContainer>
        <MyButton onPress={() => navigation.navigate('Login')}>
          <MyButtonText>
            Back to Login
          </MyButtonText>
        </MyButton>
      </ButtonContainer>
    </IconRow>
  </View>
)

export default ConfirmationScreen;
