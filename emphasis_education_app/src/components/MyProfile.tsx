import * as React from 'react';
import {
  Text,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Context from './Context/Context';

import { GET_FAMILY } from '../queries/GetFamily';
import { IGetFamilyInput, IUserPayload } from '../types';

interface IMyProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const MyProfile: React.FC<IMyProfileProps> = () => {
  const { loggedUser } = React.useContext(Context);
  const groupID = loggedUser.groupID;
  const options = { variables: { groupID }}
  const { data } = useQuery<IUserPayload, IGetFamilyInput>(GET_FAMILY, options)
  console.log('my profile data', data);

  return (
    <View>
      <Text>
        My Profile
      </Text>
    </View>
  )
}

export default MyProfile;
