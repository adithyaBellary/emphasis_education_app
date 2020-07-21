import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { IUser } from '../../types';
import Context from '../Context/Context';
import {
  ContentContain,
  IndividualField,
  HorizontalDivider,
  IconRow,
  GeneralSpacing,
  PermissionedComponent
} from '../shared';

interface IProfileProps {
  editing: boolean;
  currentUserID: string;
  family: IUser[];
}

const Title = styled(Text)`
  text-align: center;
  fontFamily: ${({ theme }) => theme.font.bold};
  font-size: 30px;
  padding: 10px 0;
`;

const Profile: React.FC<IProfileProps> = ({ family, editing, currentUserID }) => {
  const {loggedUser} = React.useContext(Context);

  console.log('the fam', family)
  let currentUser: IUser | undefined;

  if ( currentUserID === loggedUser._id) {
    // we are not coming from the admin page
    currentUser = loggedUser
  } else {
    family.forEach(familyMember => {
      if (familyMember._id === currentUserID) {
        // we have found the selected user
        currentUser = familyMember
      }
    })
  }

  console.log('currentUser', currentUser)
  if (!currentUser) { return <View><Text>could not find the user.</Text></View>; }

  let mainUserCopy = Object.assign({}, currentUser)

  const onChangeText = (text: string, label: string) => {
    if (label === 'Email') { mainUserCopy.email = text }
    if (label === 'Phone Number') { mainUserCopy.phoneNumber = text }

    console.log('mainUserCopy', mainUserCopy)
  }

  return (
    <ContentContain>
      <Title>{currentUser.name}</Title>
      <IndividualField
        value={currentUser.email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      {!editing && <HorizontalDivider width={80} />}
      <IndividualField
        value={currentUser.phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      {/* list the classes */}
      {/* lets not have this be editable */}
      {currentUser.classes && currentUser.classes.map(c => (
        <IndividualField
          value={c.className!}
          valueSize={16}
          label={'class'}
          labelSize={14}
        />
      ))}
      <IconRow>
        <Title>Family Members</Title>
        {/* <PermissionedComponent> */}
        {/* only for admins */}
          <GeneralSpacing u={0} r={0} d={0} l={10}>
            <Icon
              name='pluscircleo'
              type='antdesign'
            />
          </GeneralSpacing>
        {/* </PermissionedComponent> */}
      </IconRow>
      {
        family.map((user, index) => (
          <>
            {(user._id !== currentUser._id) && (
              <>
                <IndividualField
                  // key={index}
                  value={user.name}
                  valueSize={16}
                  label={'Name'}
                  labelSize={14}
                />
                <IndividualField
                  // key={index}
                  value={user.email}
                  valueSize={16}
                  label={'Email'}
                  labelSize={14}
                />
                {/* phone numer */}
                {/* relationship */}
              </>
            )}
          </>
        ))}
    </ContentContain>
  )
}

export  default Profile;
