import * as React from 'react';
import { Alert } from 'react-native'
import { Input } from 'react-native-elements';
import { useMutation } from '@apollo/client'

import { ThemedButton, ThemedText, FONT_STYLES, GeneralSpacing } from '../shared'
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
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <Input
        onChangeText={onChangeText}
        placeholder='Enter your email'
        inputStyle={{
          fontFamily: `${theme.font.main}`
        }}
      />
      { error && <ErrorText />}
      <ThemedButton
        block={true}
        buttonText='Send Email'
        loading={loading}
        onPress={_forgotPassword}
      />
    </GeneralSpacing>
  )
}

export default ForgotPassword;
