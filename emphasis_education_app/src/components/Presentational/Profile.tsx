import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';

import { IUser } from '../../types';
import Context from '../Context/Context';

interface IProfileProps {
  users: IUser[]
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

const Profile: React.FC<IProfileProps> = ({ users }) => {

  // let us put the logged in user in the top, so we need to get the context
  const { loggedUser } = React.useContext(Context)

  return (
    <ProfileContain>
      <Title>
        {loggedUser.name}
      </Title>
      <UserInfoContain>
        <UserInfoText>
          {loggedUser.email}
        </UserInfoText>
        <UserInfoLabel>
          Email
        </UserInfoLabel>
        {/* ugh now i need to format the phoneNumber */}
        <UserInfoText>
          {loggedUser.phoneNumber}
        </UserInfoText>
        <UserInfoLabel>
          Phone Number
        </UserInfoLabel>

      </UserInfoContain>

      {/* <Title>
        Other People
      </Title> */}

    </ProfileContain>
  )
}

export  default Profile;
