import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Divider, Icon } from 'react-native-elements';

import { IUser } from '../../types';
import Context from '../Context/Context';
import { ContentContain, IndividualField } from '../shared';

interface IProfileProps {
  mainUserID: string
  family: IUser[]
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

const UserInfoContain = styled(View)`
`

const Profile: React.FC<IProfileProps> = ({ family, mainUserID }) => {

  // let us put the logged in user in the top, so we need to get the context
  const { loggedUser } = React.useContext(Context)
  console.log('users in my profile', family)
  const mainUser: (IUser | undefined) = family.map(u => {
    if (u.groupID === mainUserID) { return u }
  })[0]
  console.log('mainUser', mainUser, mainUserID)
  if (!mainUser) { return <View><Text>could not find the user.</Text></View>; }

  return (
    <ContentContain>
      <Title>
        {mainUser.name}
      </Title>
      <UserInfoContain>
        <IndividualField
          value={mainUser.email}
          valueSize={16}
          label={'Email'}
          labelSize={14}
        />
        <Divider />
        {/* ugh now i need to format the phoneNumber */}
        <IndividualField
          value={mainUser.phoneNumber}
          valueSize={16}
          label={'Phone Number'}
          labelSize={14}
        />

        {/* list the classes */}
        {mainUser.classes && mainUser.classes.map(c => (
          <IndividualField
            value={c.className!}
            valueSize={16}
            label={'class'}
            labelSize={14}
          />
        ))}
      </UserInfoContain>
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
      <UserInfoContain>
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
                  />
                  <IndividualField
                    // key={index}
                    value={user.email}
                    valueSize={16}
                    label={'Email'}
                    labelSize={14}
                  />
                </>
              )}
            </>
          ))}
      </UserInfoContain>
    </ContentContain>
  )
}

export  default Profile;
