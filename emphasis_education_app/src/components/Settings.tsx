import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';
// import { useMutation } from '@apollo/react-hooks';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
// import { Logout } from '../queries/Logout';
// import { CommonActions } from '@react-navigation/native';
// import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './Context/Context';

interface ISettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<ISettingsProps> = () => {

  const { logout } = React.useContext(AuthContext);

  return (
    <View>
      <Text>
        settings
      </Text>
      <ButtonContainer>
        <MyButton
          onPress={() => logout()}
        >
          <MyButtonText>logout</MyButtonText>
        </MyButton>
      </ButtonContainer>
    </View>
  )
}

export default Settings;
