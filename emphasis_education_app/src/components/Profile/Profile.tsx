import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { IUser } from '../../types';
import Context from '../Context/Context';
import { ContentContain, IndividualField, HorizontalDivider } from '../shared';

interface IProfileProps {
  editing: boolean;
  mainUserID: string;
  family: IUser[];
}

const Title = styled(Text)`
  text-align: center;
  fontFamily: ${({ theme }) => theme.font.bold};
  font-size: 30px;
  padding: 10px 0;
`

const TitleWithIcon = styled(Text)`
  fontFamily: ${({ theme }) => theme.font.bold};
  font-size: 30px;
  padding: 10px 0;

`

const TitleRow = styled(View)`
  display: flex;
  flexDirection: row;
  justify-content: center;
  align-items: center;
`

const IconContain = styled(View)`
  padding: 0 5px;
`

const Profile: React.FC<IProfileProps> = ({ family, mainUserID, editing }) => {

  // console.log('editing', editing)
  const mainUser: (IUser | undefined) = family.map(u => {
    if (u.groupID === mainUserID) { return u }
  })[0]
  console.log('mainUser', mainUser, mainUserID)
  if (!mainUser) { return <View><Text>could not find the user.</Text></View>; }

  let mainUserCopy = Object.assign({}, mainUser)
  console.log(mainUserCopy)

  const onChangeText = (text: string, label: string) => {
    mainUserCopy = {
      ...mainUserCopy,
      [label]: text
    }
    console.log('mainUserCopy', mainUserCopy)
  }

  return (
    <ContentContain>
      <Title>
        {mainUser.name}
      </Title>
      <IndividualField
        value={mainUser.email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      {!editing && <HorizontalDivider width={80} />}
      <IndividualField
        value={mainUser.phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      {/* list the classes */}
      {/* lets not have this be editable */}
      {mainUser.classes && mainUser.classes.map(c => (
        <IndividualField
          value={c.className!}
          valueSize={16}
          label={'class'}
          labelSize={14}
          // editing={editing}
        />
      ))}
      <TitleRow>
        <TitleWithIcon>
          Family Members
        </TitleWithIcon>
        <IconContain>
          <Icon
            name='pluscircleo'
            type='antdesign'
            // onPress={}
          />
        </IconContain>
      </TitleRow>
      {
        family.map((user, index) => (
          <>
            {(user._id !== mainUser._id) && (
              <>
                <IndividualField
                  // key={index}
                  value={user.name}
                  valueSize={16}
                  label={'Name'}
                  labelSize={14}
                  // editing={editing}
                />
                <IndividualField
                  // key={index}
                  value={user.email}
                  valueSize={16}
                  label={'Email'}
                  labelSize={14}
                  // editing={editing}
                />
              </>
            )}
          </>
        ))}
    </ContentContain>
  )
}

export  default Profile;
