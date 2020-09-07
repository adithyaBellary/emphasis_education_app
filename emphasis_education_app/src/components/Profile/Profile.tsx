import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { IUser, Permission, Class } from '../../types';
import { GeneralContext } from '../Context/Context';
import {
  ContentContain,
  IndividualField,
  HorizontalDivider,
  IconRow,
  GeneralSpacing,
  PermissionedComponent,
  ThemedText,
  FONT_STYLES
} from '../shared';
import { theme } from '../../theme';

interface ProfileProps {
  editing: boolean;
  currentUserID: string;
  family: IUser[];
  onPress (): void;
}

const Title = styled(Text)`
  text-align: center;
  fontFamily: ${({ theme }) => theme.font.bold};
  font-size: 30px;
  padding: 10px 0;
`;

const ListClasses: React.FC<{ classes: Class[]}> = ({ classes }) => (
  <>
    {classes.map(_class => (
      <ThemedText
        size={16}
        type={FONT_STYLES.MAIN}
      >
        {_class.className}
      </ThemedText>
    ))}
    <ThemedText
      size={14}
      type={FONT_STYLES.LIGHT}
    >
      Classes
    </ThemedText>
  </>
)

const Profile: React.FC<ProfileProps> = ({ family, editing, currentUserID, onPress }) => {
  const {loggedUser} = React.useContext(GeneralContext);

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

  if (!currentUser) { return <View><Text>could not find the user.</Text></View>; }

  let mainUserCopy = Object.assign({}, currentUser)

  const onChangeText = (text: string, label: string) => {
    if (label === 'Email') { mainUserCopy.email = text }
    if (label === 'Phone Number') { mainUserCopy.phoneNumber = text }

    console.log('mainUserCopy', mainUserCopy)
  }

  return (
    <ContentContain>
      <Title>{currentUser.firstName} {currentUser.lastName}</Title>
      <IndividualField
        value={currentUser.email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      {!editing && <HorizontalDivider width={80} color={theme.colors.lightPink}/>}
      <IndividualField
        value={currentUser.phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      <IndividualField
        value={currentUser.dob}
        valueSize={16}
        label={'Date of Birth'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      {currentUser.classes && <ListClasses classes={currentUser.classes}/>}

      <IconRow>
        <Title>Family Members</Title>
        <PermissionedComponent
          allowedPermissions={[Permission.Admin]}
        >
          <GeneralSpacing u={0} r={0} d={0} l={10}>
            <Icon
              name='pluscircleo'
              type='antdesign'
              onPress={onPress}
            />
          </GeneralSpacing>
        </PermissionedComponent>
      </IconRow>
      {
        family.map((user, index) => (
          <>
            {(user._id !== currentUser._id) && (
              <>
                <IndividualField
                  // key={index}
                  value={`${user.firstName} ${user.lastName}`}
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
