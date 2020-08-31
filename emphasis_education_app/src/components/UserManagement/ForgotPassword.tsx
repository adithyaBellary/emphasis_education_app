import * as React from 'react';
import {
  View,
  Alert
} from 'react-native'
import { Input } from 'react-native-elements';
import { useMutation } from '@apollo/react-hooks'

import { ThemedButton, ThemedText, FONT_STYLES } from '../shared'
import { theme } from '../../theme';
import { FORGOT_PASSWORD } from '../../queries/ForgotPassword';

const ErrorText: React.FC = () => (
  <ThemedText
    size={14}
    type={FONT_STYLES.MAIN}
    error={true}
  >
    There was an error sending the password reset email.
    Please check to make sure that this is a valid email address.
  </ThemedText>
)

const ForgotPassword: React.FC = () => {

  const [runMut, { data, error, loading }] = useMutation(FORGOT_PASSWORD);
  const [email, setEmail] = React.useState('')

  const onChangeText = (email: string) => setEmail(email);
  const _forgotPassword = () => {
    runMut({ variables: { email }}).then(() => {
      Alert.alert('Successfully sent the forgot password email')
    })
    .catch(e => console.log('Error with the forgot password mutation', e))
  }

  if (error) { console.log('there was an error', error) }

  return (
    <View>
      <Input
        onChangeText={onChangeText}
        placeholder='Enter your email'
        inputStyle={{
          fontFamily: `${theme.font.main}`
        }}
      />
      { error && <ErrorText />}
      <ThemedButton
        buttonText='Send Email'
        loading={loading}
        onPress={_forgotPassword}
      />
    </View>
  )
}

export default ForgotPassword;
