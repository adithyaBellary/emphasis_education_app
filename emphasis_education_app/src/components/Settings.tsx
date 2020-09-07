import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { ButtonContainer, MyButton, MyButtonText, ThemedButton } from './shared';
import { AuthContext } from './Context/Context';

interface SettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<SettingsProps> = () => {

  const { logout } = React.useContext(AuthContext);

  return (
    <View>
      <Text>
        settings
      </Text>
      <ButtonContainer>
        <ThemedButton
          buttonText='Logout'
          loading={false}
          onPress={() => logout()}
        />
      </ButtonContainer>
    </View>
  )
}

export default Settings;
