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

interface IConfirmationScreenProps {
  users: ICreateUserArr | undefined;
  submit(): void;
}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<IConfirmationScreenProps> = ({ users, submit }) => {
  console.log('props', users)
  // display the data just entered

  return (
    <View>
      <Text>
        Confirming
      </Text>
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
