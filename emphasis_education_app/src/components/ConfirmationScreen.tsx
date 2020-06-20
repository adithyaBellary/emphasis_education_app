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
    <Text>
      Confirming
    </Text>
    {createdUsers && createdUsers.users.map((user: IUserInput, index: number) => (
      <IndividualItem
        id={index + 1}
        {...user}
      />
    ))}
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
