import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native';
import {
  ButtonContainer,
  ContentContain,
  IconRow,
  ThemedButton
} from '../shared';
import { CreateUserArr } from './CreateUserContainer';
import IndividualItem from './DisplayIndividualMember';

import { IUsableUserInfo } from '../../types';

interface ConfirmationScreenProps {
  navigation: any;
  route: any

}

// we need to be able to edit info from here
const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  navigation,
  route
}) => {
  const users: IUsableUserInfo[] = route.params.users
  console.log('users in confirmation', users)

  return (
    <View>
      <Text>
      hi
      </Text>
    </View>
  )

}

export default ConfirmationScreen;
