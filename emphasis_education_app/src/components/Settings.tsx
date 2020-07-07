import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
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
