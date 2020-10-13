import * as React from 'react';
import {
  View,
  TextInput,
  ScrollView
} from 'react-native';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';

import { SEND_BUG_EMAIL } from '../queries/SendBugEmail';

import { ThemedButton } from './shared';
import { AuthContext, GeneralContext } from './Context/Context';

export const StyledTextInput = styled(TextInput)`
  height: 100px
  border: grey solid 1px;
  padding: 15px;
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

  const [runMutation, {loading}] = useMutation(SEND_BUG_EMAIL);

  const sendEmail = () => {
    console.log(loggedUser.email, message)
    runMutation({ variables: {
      user: loggedUser.email,
      body: message
    }})
    .then(res => {
      console.log('res, ', res)
    })
    .catch (e => console.log('error sendng the bug email, ', e))
  }

  return (
    <View style={{flex: 1, padding: 20}}>
      <ScrollView alwaysBounceVertical={false}>
        <StyledTextInput
          multiline={true}
          placeholder='Notice anything weird? Let us know here!'
          onChangeText={text => setMessage(text)}
        />
        <View style={{ paddingVertical: 25}}>
          <ThemedButton
            buttonText='Submit feedback'
            loading={loading}
            block={true}
            onPress={() => sendEmail()}
          />
        </View>
      </ScrollView>
        <View style={{ marginBottom: 50}}>
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
