import * as React from 'react';
import {
  View,
  Text
} from 'react-native'
import { Divider } from 'react-native-elements';


import { IUserInput } from '../../types';
import { ThemedText, IndividualField, FONT_STYLES } from '../shared';

const IndividualItem: React.FC<IUserInput & {id: number}> = ({
  firstName, lastName, email, password, phoneNumber, userType, id, gender, dob }) => {

  return (
    <View>
      <ThemedText size={18} type={FONT_STYLES.MAIN}>
        Family member {id}
      </ThemedText>
      <Divider />
      <IndividualField
        value={firstName}
        valueSize={16}
        label={'Name'}
        labelSize={14}
      />
      <IndividualField
        value={lastName}
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
      <IndividualField
        value={dob}
        valueSize={16}
        label={'Date of Birth'}
        labelSize={14}
      />
    </View>
  )
}

export default IndividualItem;
