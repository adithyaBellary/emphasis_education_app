import * as React from 'react';
import {
  Alert,
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native';
import { useMutation } from '@apollo/client';

import { CREATE_USER } from '../../queries/CreateUser';
import {
  ButtonContainer,
  ContentContain,
  IconRow,
  ThemedButton
} from '../shared';
import { CreateUserArr } from './CreateUserContainer';
import IndividualItem from './DisplayIndividualMember';

import { IUsableUserInfo, GenericResponse } from '../../types';

interface ConfirmationScreenProps {
  navigation: any;
  route: any
}

const SuccessMessaging: string = 'Thank you for joining Emphasis Education!';
const ErrorMessaging: string = 'There was an issue creating this user';

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  navigation,
  route
}) => {
  const users: IUsableUserInfo[] = route.params.users
  console.log('users in confirmation', users)

  const [createUserMut, { data, loading, error }] = useMutation(
    CREATE_USER,
    {
      onCompleted: ({ createUser }) => {
        console.log('Done running create user mutation: ', createUser)
        const { res, message }: GenericResponse = createUser;
        Alert.alert(res ? SuccessMessaging : message || ErrorMessaging );
      }
    }
  )

  if(error) {
    Alert.alert(data?.message || 'Something went wrong creating this user!')
  }

  const runCreateUserMut = (): void => {
    console.log('creating users with ', users)
    // createUserMut({
    //   variables: {
    //     users
    //   },
    // })s
  }

  return (
    <ScrollView style={{ marginBottom: 30 }}>
      <ContentContain>
        {users.map((_user, index) => (
          <IndividualItem
            key={index}
            id={index + 1}
            {..._user}
          />
        ))}
      </ContentContain>
      <IconRow>
        <ButtonContainer>
          <ThemedButton
            buttonText="Submit Users"
            loading={false}
            block={true}
            onPress={runCreateUserMut}
          />
        </ButtonContainer>
      </IconRow>
      <IconRow>
        <ButtonContainer>
          <ThemedButton
            buttonText="Back to Create User"
            loading={false}
            onPress={navigation.goBack}
          />
        </ButtonContainer>
        <ButtonContainer>
          <ThemedButton
            buttonText="Back to Login"
            loading={false}
            onPress={() => navigation.navigate('Login')}
          />
        </ButtonContainer>
      </IconRow>
    </ScrollView>
  )

}

export default ConfirmationScreen;
