import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { Permission } from '../../types';
import { GeneralContext } from '../Context/Context';
import {
  IndividualField,
  HorizontalDivider,
  IconRow,
  GeneralSpacing,
  PermissionedComponent,
  ThemedText,
  FONT_STYLES
} from '../shared';
import { theme } from '../../theme';
import { UserInfoType, Chat } from '../../../types/schema-types';

interface ProfileProps {
  editing: boolean;
  currentUserID: string;
  family: UserInfoType[];
  onPress (): void;
}

const Title = ({ children }) =>
  <GeneralSpacing
    u={10}
    r={0}
    d={10}
    l={0}
    centered={true}
  >
    <ThemedText
      size={30}
      type={FONT_STYLES.BOLD}
    >
      {children}
    </ThemedText>
  </GeneralSpacing>

const ListClasses: React.FC<{ classes: Chat[]}> = ({ classes }) => (
  <>
    {classes.map(_class => (
      <ThemedText
        size={16}
        type={FONT_STYLES.MAIN}
        key={_class.chatID}
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

const ContentScroll = styled(ScrollView)`
  padding: 0 20px;
  margin-bottom: 60px;
`

const Profile: React.FC<ProfileProps> = ({ family, editing, currentUserID, onPress }) => {
  const {loggedUser} = React.useContext(GeneralContext);

  let currentUser: UserInfoType | undefined;

  if ( currentUserID === loggedUser._id) {
    // we are not coming from the admin page
    currentUser = loggedUser
  } else {
    if (family) {
      family.forEach(familyMember => {
        if (familyMember._id === currentUserID) {
          // we have found the selected user
          currentUser = familyMember
        }
      })
    }

  }

  if (!currentUser) {
    return (
      <View>
        <ThemedText
          size={14}
          type={FONT_STYLES.MAIN}
        >
          could not find the user.
        </ThemedText>
      </View>
    )
  }

  let mainUserCopy = Object.assign({}, currentUser)

  const onChangeText = (text: string, label: string) => {
    if (label === 'Email') { mainUserCopy.email = text }
    if (label === 'Phone Number') { mainUserCopy.phoneNumber = text }

    // console.log('mainUserCopy', mainUserCopy)
  }

  const getRelationship = (userType: Permission) => {
    if (currentUser?.userType === Permission.Student) {
      if (userType === Permission.Student) {
        return 'Sibling'
      }
      if (userType === Permission.Guardian) {
        return 'Guardian'
      }
    }
    if (currentUser) {
      if (currentUser.userType === Permission.Guardian) {
        if (userType === Permission.Student) {
          return 'Child'
        }
        if (userType === Permission.Guardian) {
          return 'Significant Other'
        }
      }
    }
    return 'N/A'
  }

  // if (!family) {
  //   return null
  // }

  return (
    <ContentScroll>
      <Title>{currentUser.firstName} {currentUser.lastName}</Title>
      <IndividualField
        value={currentUser.email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      <HorizontalDivider width={100} color={theme.colors.lightPink}/>
      <IndividualField
        value={currentUser.phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      <HorizontalDivider width={100} color={theme.colors.lightPink}/>
      <IndividualField
        value={currentUser.dob}
        valueSize={16}
        label={'Date of Birth'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      <HorizontalDivider width={100} color={theme.colors.lightPink}/>
      <IndividualField
        value={currentUser.userType}
        valueSize={16}
        label={'User Type'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      {currentUser.classes && (
        <>
          <HorizontalDivider width={100} color={theme.colors.lightPink} />
          <ListClasses classes={currentUser.classes || []} />
        </>
      )}

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
                <HorizontalDivider width={100} color={theme.colors.lightPink}/>
                <IndividualField
                  // key={index}
                  value={user.email}
                  valueSize={16}
                  label={'Email'}
                  labelSize={14}
                />
                <HorizontalDivider width={100} color={theme.colors.lightPink}/>
                {/* phone numer */}
                <IndividualField
                  value={user.phoneNumber}
                  valueSize={16}
                  label={'Phone Number'}
                  labelSize={14}
                />
                <HorizontalDivider width={100} color={theme.colors.lightPink}/>
                <IndividualField
                  value={user.userType}
                  valueSize={16}
                  label={'User Type'}
                  labelSize={14}
                />
                <HorizontalDivider width={100} color={theme.colors.lightPink}/>
                <IndividualField
                  value={getRelationship(user.userType)}
                  valueSize={16}
                  label='Relationship'
                  labelSize={14}
                />
                {user.classes && (
                  <>
                    <HorizontalDivider width={100} color={theme.colors.lightPink}/>
                    <ListClasses classes={user.classes || []} />
                  </>
                )}

              </>
            )}
          </>
        ))}
    </ContentScroll>
  )
}

export  default Profile;
