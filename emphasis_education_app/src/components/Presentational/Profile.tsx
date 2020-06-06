import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Divider } from 'react-native-elements';

import { IUser } from '../../types';
import Context from '../Context/Context';

interface IProfileProps {
  mainUserID: string
  family: IUser[]
}

const ProfileContain = styled(View)`
  padding: 20px ;
`

const Title = styled(Text)`
  text-align: center;
  fontFamily: 'Nunito-Bold';
  font-size: 30px;
  padding: 10px 0;
`

const UserInfoContain = styled(View)`
`

const UserInfoText = styled(Text)`
  font-size: 16px;
`
const UserInfoLabel = styled(Text)`
  font-size: 14px;
  fontFamily: 'Nunito-Light';
`
interface IIndividualFieldProps {
  value: string;
  label: string;
}

const IndividualField: React.FC<IIndividualFieldProps> = ({ value, label}) => (
  <>
    <UserInfoText>
      {value}
    </UserInfoText>
    <UserInfoLabel>
      {label}
    </UserInfoLabel>
  </>
)

const Profile: React.FC<IProfileProps> = ({ family, mainUserID }) => {

  // let us put the logged in user in the top, so we need to get the context
  const { loggedUser } = React.useContext(Context)
  console.log('users in my profile', family)
  const mainUser: (IUser | undefined) = family.map(u => {
    if (u.groupID === mainUserID) {
      return u
    }
  })[0]
  console.log('mainUser', mainUser, mainUserID)
  if (!mainUser) { return null; }
  return (
    <ProfileContain>
      <Title>
        {mainUser.name}
      </Title>
      <UserInfoContain>
        <IndividualField
          value={mainUser.email}
          label={'Email'}
        />
        <Divider />
        {/* ugh now i need to format the phoneNumber */}
        <IndividualField
          value={mainUser.phoneNumber}
          label={'Phone Number'}
        />

        {/* list the classes */}
      </UserInfoContain>

      {/* lets only render this stuff if we have other users to render outside of just the logged in user */}
      <Title>
        Family Members
      </Title>
      <UserInfoContain>
        {
          family.map((user, index) => (
            <>
              <IndividualField
                // key={index}
                value={user.name}
                label={'Name'}
              />
              <IndividualField
                // key={index}
                value={user.email}
                label={'Email'}
              />
            </>
          ))
        }

      </UserInfoContain>

    </ProfileContain>
  )
}

export  default Profile;
