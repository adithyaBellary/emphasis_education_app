import * as React from 'react';
import { Input } from 'react-native-elements';
import { useLazyQuery } from '@apollo/client'

import { CHECK_CODE } from '../../queries/CheckCode';
import {
  GeneralSpacing,
   ThemedText,
   ThemedButton,
   FONT_STYLES,
   CenteredDiv
} from '../shared';
import { theme } from '../../theme';

interface EnterCodeProps {
  navigation: any;
  route: any;
}

const ErrorMessage: React.FC = () => (
  <CenteredDiv>
    <ThemedText type={FONT_STYLES.MAIN} size={14} error={true}>
      You entered the wrong code
    </ThemedText>
  </CenteredDiv>
)

const EnterCode: React.FC<EnterCodeProps> = ({ navigation }) => {

  const [code, setCode] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState(false)

  const [runQuery, {data, loading}] = useLazyQuery(CHECK_CODE, {
    onCompleted: ({ checkCode }) => {
      if (checkCode.res) {
        navigation.navigate('CreateUserContain')
      } else {
        setError(true)
      }
    },
    fetchPolicy: 'no-cache'
  })

  const onChangeTextCode = (val: string) => setCode(val)
  const onChangeTextEmail = (val: string) => setEmail(val);

  const _checkCode = () => runQuery({ variables: { email, code }})

  return (
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <Input
        placeholder='Enter your email'
        onChangeText={onChangeTextEmail}
        inputStyle={{
          fontFamily: `${theme.font.main}`
        }}
      />
      <Input
        placeholder='Enter your code'
        onChangeText={onChangeTextCode}
        inputStyle={{
          fontFamily: `${theme.font.main}`
        }}
      />
      { error && <ErrorMessage /> }
      <ThemedButton
        block={true}
        buttonText='Submit Code'
        loading={loading}
        onPress={_checkCode}
      />

    </GeneralSpacing>
  );
}

export default EnterCode;
