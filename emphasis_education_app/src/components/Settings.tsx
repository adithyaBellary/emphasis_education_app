import * as React from 'react';
import {
  View,
  Text,
  Alert
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
import { Logout } from '../queries/Logout';

interface ISettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<ISettingsProps> = ({ navigation }) => {

  const [runMut, { data, loading, error}] = useMutation(
    Logout,
    {
      onCompleted: () => {
        navigation.navigate('Login')
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
