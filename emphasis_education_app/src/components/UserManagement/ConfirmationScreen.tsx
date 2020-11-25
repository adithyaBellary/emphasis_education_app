import * as React from 'react';
import {
  View,
  ScrollView,
  FlatList
} from 'react-native';
import {
  ButtonContainer,
  ContentContain,
  IconRow,
  ThemedButton
} from '../shared';
import { CreateUserArr } from './CreateUserContainer';
import IndividualItem from './DisplayIndividualMember';

import { IUserInput } from '../../types';

interface ConfirmationScreenProps {
  navigation: any;
  createdUsers: CreateUserArr | undefined;
  loading: boolean;
  submitDisabled: boolean;
  BackToUserCreate(): void;
  submit(): void;
}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  createdUsers,
  loading,
  submit,
  submitDisabled,
  BackToUserCreate,
  navigation
}) => (
  <ScrollView style={{ marginBottom: 30 }}>
    <ContentContain>
      {createdUsers && createdUsers.users.map((user: IUserInput, index: number) => (
        <IndividualItem
          key={index}
          id={index + 1}
          {...user}
        />
      ))}
    </ContentContain>
    <View
      style={{
        marginTop: 30
      }}
    >
      <IconRow>
        <ButtonContainer
          style={{
            width: '80%'
          }}
        >
          <ThemedButton
            buttonText='Submit'
            loading={loading}
            onPress={submit}
            disabled={submitDisabled}
            block={true}
          />
        </ButtonContainer>
      </IconRow>
      <IconRow>
        <ButtonContainer>
          <ThemedButton
            buttonText='Back to create user'
            loading={false}
            onPress={BackToUserCreate}
          />
        </ButtonContainer>
        <ButtonContainer>
          <ThemedButton
            buttonText='Back to Login'
            loading={false}
            onPress={() => navigation.navigate('Login')}
          />
        </ButtonContainer>
      </IconRow>
    </View>
  </ScrollView>
)

export default ConfirmationScreen;
