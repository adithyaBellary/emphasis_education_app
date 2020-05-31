import * as React from 'react';
import {
  Text,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Context from './Context/Context';
import Profile from './Presentational/Profile';

import { GET_FAMILY } from '../queries/GetFamily';
import { IGetFamilyInput, IUserPayload } from '../types';

interface ILiftedProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const LiftedProfile: React.FC<ILiftedProfileProps> = () => {
  const { loggedUser } = React.useContext(Context);
  const groupID = loggedUser.groupID;
  const options = { variables: { groupID }}
  const { data, loading, error } = useQuery<IUserPayload, IGetFamilyInput>(GET_FAMILY, options)
  console.log('my profile data', data);
  if ( error ) { console.log('error loading the profile')}

  return (
    <>
    {
      loading ? (
        <View>
          <Text>
            loading
          </Text>
        </View>
      ) : (
      <Profile />
      )
    }
    </>
  )
}

export default LiftedProfile;