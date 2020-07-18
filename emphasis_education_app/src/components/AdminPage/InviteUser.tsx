import * as React from 'react';
import {
  Input,
} from 'react-native-elements'
import { useMutation } from '@apollo/react-hooks';

import { ContentContain } from './common'
import { ThemedButton } from '../shared';

import { CREATE_CODE } from '../../queries/CreateCode';
import { Alert } from 'react-native';

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
  const handleTextChange = (text: string) => setEmail(text)

  const [runMut, { data, loading }] = useMutation(CREATE_CODE)

  const createCode = () => {
    runMut({ variables: {
      email
    }}).then(({ data }) => {
      if (data.createCode.res) {
        console.log('success creating the code')
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
      <CreateCodeButton runMutation={createCode} loading={loading} />
    </ContentContain>
  )
}

export default InviteUser;
