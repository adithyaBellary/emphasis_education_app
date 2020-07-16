import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import {
  Input,
  Button
} from 'react-native-elements'
import { useMutation } from '@apollo/react-hooks';

import { ContentContain } from './common'
import { MyButton, MyButtonText } from '../shared';

import { CREATE_CODE } from '../../queries/CreateCode';
import { Alert } from 'react-native';

interface ICreateCodeButtonProps {
  runMutation(): void;
}

const CreateCodeButton: React.FC<ICreateCodeButtonProps> = ({ runMutation }) => (
  <MyButton onPress={runMutation}>
    <MyButtonText>
      Create Code
    </MyButtonText>
  </MyButton>
)

const InviteUser: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const handleTextChange = (text: string) => setEmail(text)

  const [runMut, { data }] = useMutation(CREATE_CODE)

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
      <CreateCodeButton runMutation={createCode}/>
    </ContentContain>
  )
}

export default InviteUser;
