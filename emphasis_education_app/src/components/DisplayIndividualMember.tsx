import * as React from 'react';
import {
  View,
  Text
} from 'react-native'

import { IUserInput, Permission } from '../types';

const IndividualItem: React.FC<IUserInput & {id: number}> = ({ name, email, password, phoneNumber, userType, id }) => {

  return (
    <View>
      <Text>
        Family member {id}
      </Text>
      <Text>
        {name}
      </Text>
      <Text>
        {email}
      </Text>
      <Text>
        {password}
      </Text>
      <Text>
        {phoneNumber}
      </Text>
      <Text>
        {userType}
      </Text>

    </View>
  )
}

export default IndividualItem;
