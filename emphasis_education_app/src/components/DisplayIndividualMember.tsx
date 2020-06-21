import * as React from 'react';
import {
  View,
  Text
} from 'react-native'
import { Divider } from 'react-native-elements';


import { IUserInput, Permission } from '../types';
import { ThemedText } from './shared';
import  { IndividualField } from './shared';

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
      {/* <ThemedText size={16}>
        {email}
      </ThemedText> */}
      <IndividualField
        value={password}
        valueSize={16}
        label={'Password'}
        labelSize={14}
      />
      {/* <ThemedText size={16}>
        {password}
      </ThemedText> */}
      <IndividualField
        value={phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
      />
      {/* <ThemedText size={16}>
        {phoneNumber}
      </ThemedText> */}
      <IndividualField
        value={userType}
        valueSize={16}
        label={'User Type'}
        labelSize={14}
      />
      {/* <ThemedText size={16}>
        {userType}
      </ThemedText> */}
      <IndividualField
        value={gender}
        valueSize={16}
        label={'Gender'}
        labelSize={14}
      />
      {/* <ThemedText size={16}>
        {gender}
      </ThemedText> */}
    </View>
  )
}

export default IndividualItem;
