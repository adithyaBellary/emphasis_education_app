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
  ContentContain
} from './shared';
import { ICreateUserArr } from './CreateUserContainer';
import IndividualItem from './DisplayIndividualMember';

import { IUserInput } from '../types';

interface IConfirmationScreenProps {
  createdUsers: ICreateUserArr | undefined;
  loading: boolean;
  submit(): void;
}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<IConfirmationScreenProps> = ({ createdUsers, loading, submit }) => (
  <View>
    <ContentContain>
      {createdUsers && createdUsers.users.map((user: IUserInput, index: number) => (
        <IndividualItem
          id={index + 1}
          {...user}
        />
      ))}
    </ContentContain>
    <ButtonContainer>
      <MyButton>
        <MyButtonText
          onPress={submit}
        >
          Submit
        </MyButtonText>
        {loading && <ActivityIndicator/>}
      </MyButton>
    </ButtonContainer>
  </View>
)

export default ConfirmationScreen;
