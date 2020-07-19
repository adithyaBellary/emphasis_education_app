import * as React from 'react';
import { Alert } from 'react-native';
import {
  Input,
} from 'react-native-elements'
import { useMutation } from '@apollo/react-hooks';

import { ContentContain } from './common'
import {
  ThemedButton,
  ThemedText,
  GeneralSpacing
} from '../shared';

import { CREATE_CODE } from '../../queries/CreateCode';

interface ICreateCodeButtonProps {
  loading: boolean;
  runMutation(): void;
}

const CreateCodeButton: React.FC<ICreateCodeButtonProps> = ({ runMutation, loading }) => (
  <ThemedButton
    buttonText='Create Code'
    loading={loading}
    onPress={runMutation}
  />
);

const InviteUser: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const handleTextChange = (text: string) => setEmail(text)

  const [runMut, { data, loading }] = useMutation(CREATE_CODE)

  const createCode = () => {
    runMut({ variables: {
      email
    }}).then(({ data }) => {
      if (data.createCode.res) {
        console.log('success creating the code')
        setCode(data.createCode.code)
        Alert.alert('Successfully created the code')
      } else {
        Alert.alert('Unsuccessfully created the code')
        console.log('could not create the code')
      }
    }).catch( e => {
      console.log('something went wrong creating the code. Reach out to Adithya', e)
    })
  }

  return (
    <ContentContain>
      <Input
        onChangeText={handleTextChange}
        placeholder='Enter new user email here'
      />
      <GeneralSpacing u={10} r={0} d={10} l={10}>
        <ThemedText size={16} type='main'>
          Created Code: {code}
        </ThemedText>
      </GeneralSpacing>
      <CreateCodeButton runMutation={createCode} loading={loading} />
    </ContentContain>
  )
}

export default InviteUser;
