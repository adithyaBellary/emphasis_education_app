import * as React from 'react';
import {
  View,
  ScrollView
} from 'react-native';
import {
  ButtonContainer,
  ContentContain,
  IconRow,
  ThemedButton
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
        <ThemedButton
          buttontext='Submit'
          loading={loading}
          onPress={submit}
        />

      </ButtonContainer>
      <ButtonContainer>
        <ThemedButton
          buttontext='Back to Login'
          loading={false}
          onPress={() => navigation.navigate('Login')}
        />
      </ButtonContainer>
    </IconRow>
  </View>
)

export default ConfirmationScreen;
