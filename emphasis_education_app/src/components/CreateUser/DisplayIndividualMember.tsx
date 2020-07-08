import * as React from 'react';
import {
  View,
  Text
} from 'react-native'
import { Divider } from 'react-native-elements';


import { IUserInput } from '../../types';
import { ThemedText, IndividualField } from '../shared';

const IndividualItem: React.FC<IUserInput & {id: number}> = ({
  name, email, password, phoneNumber, userType, id, gender }) => {

  return (
    <View>
      <ThemedText size={18} type={'main'}>
        Family member {id}
      </ThemedText>
      <Divider />
      <IndividualField
        value={name}
        valueSize={16}
        label={'Name'}
        labelSize={14}
      />
      <IndividualField
        value={email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
      />

      <IndividualField
        value={password}
        valueSize={16}
        label={'Password'}
        labelSize={14}
      />

      <IndividualField
        value={phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
      />

      <IndividualField
        value={userType}
        valueSize={16}
        label={'User Type'}
        labelSize={14}
      />

      <IndividualField
        value={gender}
        valueSize={16}
        label={'Gender'}
        labelSize={14}
      />

    </View>
  )
}

export default IndividualItem;
