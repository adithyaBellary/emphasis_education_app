import * as React from 'react';
import { View } from 'react-native'

import { IUserInput } from '../../types';
import {
  ThemedText,
  IndividualField,
  FONT_STYLES,
  GeneralSpacing,
  CenteredDiv,
  HorizontalDivider
 } from '../shared';

const IndividualItem: React.FC<IUserInput & {id: number}> = ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  userType,
  id,
  gender,
  dob
}) => (
  <View>
    <CenteredDiv>
      <GeneralSpacing u={10} r={10} d={10} l={0}>
        <ThemedText size={18} type={FONT_STYLES.MAIN}>
          Family Member {id}
        </ThemedText>
      </GeneralSpacing>
    </CenteredDiv>
    <HorizontalDivider width={100} color='grey' />
    <IndividualField
      value={firstName}
      valueSize={16}
      label={'First Name'}
      labelSize={14}
    />
    <IndividualField
      value={lastName}
      valueSize={16}
      label={'Last Name'}
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
      value={dob}
      valueSize={16}
      label={'Date of Birth'}
      labelSize={14}
    />
  </View>
)

export default IndividualItem;
