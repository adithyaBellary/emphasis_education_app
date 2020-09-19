import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView
} from 'react-native';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';

import {
  ThemedButton,
  ContentContain as Contain
} from './shared';
import { AuthContext, GeneralContext } from './Context/Context';
import { SEND_BUG_EMAIL } from '../queries/SendBugEmail';

const StyledTextInput = styled(TextInput)`
  height: 100px
  border: grey solid 1px;
  padding: 20px;
  border-radius: 10px;
`;

interface SettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<SettingsProps> = () => {
  const [message, setMessage] = React.useState('');
  const { logout } = React.useContext(AuthContext);
  const { loggedUser } = React.useContext(GeneralContext);

  const [runMutation, {data, loading}] = useMutation(SEND_BUG_EMAIL);

  const sendEmail = () => {
    runMutation({ variables: {
      user: loggedUser.email,
      body: message
    }})
  }

  return (
    <View style={{flex: 1, padding: 20}}>
      <ScrollView alwaysBounceVertical={false}>
        <StyledTextInput
          multiline={true}
          placeholder='Notice anything weird? Let us know here!'
          onChangeText={text => setMessage(text)}
        />
        <ThemedButton
          buttonText='Submit'
          loading={loading}
          block={true}
          onPress={() => sendEmail()}
          />
      </ScrollView>
        <View style={{ marginBottom: 35}}>
          <ThemedButton
            block={true}
            buttonText='Logout'
            loading={false}
            onPress={() => logout()}
          />
        </View>
    </View>
  )
}

export default Settings;
