import * as React from 'react';
import {
  View,
  Text
} from 'react-native'
import { Input } from 'react-native-elements';

import { ThemedButton } from '../shared'
import { theme } from '../../theme';

const ForgotPassword: React.FC = () => {

  return (
    <View>
      <Input
        placeholder='Enter your emain'
        inputStyle={{
          fontFamily: `${theme.font.main}`
        }}
      />
      <ThemedButton
        buttonText='Send Email'
        loading={false}
        onPress={() => console.log('sending the mutation')}
      />
    </View>
  )
}

export default ForgotPassword;
