import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Context from '../Context/Context';
import Profile from './Profile';

import { GET_FAMILY } from '../../queries/GetFamily';
import { IGetFamilyInput, IGetFamilyPayload } from '../../types';

interface ILiftedProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const LiftedProfile: React.FC<ILiftedProfileProps> = ({ route }) => {
  console.log('route in profile', route)
  const mainUserID: string = route.params.groupID
  // what i get passed here is what will go on the top of the profile page
  const options = { variables: { groupID: mainUserID }}
  const { data, loading, error } = useQuery<IGetFamilyPayload, IGetFamilyInput>(GET_FAMILY, options)
  console.log('my profile data', data);
  if ( error ) { console.log('error loading the profile')}

  return (
    <>
    {
      loading ? <ActivityIndicator /> : (
        <Profile
          mainUserID={mainUserID}
          family={data ? data.getFamily : []}
        />
      )
    }
    </>
  )
}

export default LiftedProfile;
