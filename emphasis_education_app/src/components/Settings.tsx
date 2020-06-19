import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
import { Logout } from '../queries/Logout';
import { CommonActions } from '@react-navigation/native';

interface ISettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<ISettingsProps> = ({ navigation }) => {

  const [runMut, { data, loading, error}] = useMutation(
    Logout,
    {
      onCompleted: () => {
        navigation.dispatch(
          CommonActions.reset({
            // it is one of these two probs
            // index: 1,
            index: 0,
            routes: [
              { name: 'Login'}
            ]
          })
        )
      }
    }
  );
  console.log('data', data)
  console.log('error', error)

  return (
    <View>
      <Text>
        settings
      </Text>
      <ButtonContainer>
        <MyButton
          onPress={() => runMut()}
        >
          <MyButtonText>logout</MyButtonText>
        </MyButton>
      </ButtonContainer>
    </View>
  )
}

export default Settings;
