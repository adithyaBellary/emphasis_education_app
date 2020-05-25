import * as React from 'react';
import {
  View,
  Text
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
  submit(): void;
}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<IConfirmationScreenProps> = ({ createdUsers, submit }) => {
  console.log('props in confirmation', createdUsers)
  // display the data just entered
  // if (createdUsers) {
  //   const { users } = createdUsers;
  // }

  return (
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
        </MyButton>
      </ButtonContainer>

    </View>
  )
}

export default ConfirmationScreen;
