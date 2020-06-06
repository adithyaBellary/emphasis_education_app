import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Context from './Context/Context';
import Profile from './Presentational/Profile';

import { GET_FAMILY } from '../queries/GetFamily';
import { IGetFamilyInput, IGetFamilyPayload } from '../types';

interface ILiftedProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const LiftedProfile: React.FC<ILiftedProfileProps> = ({ route }) => {
  const { loggedUser } = React.useContext(Context);
  const groupID = loggedUser.groupID;
  // what i get passed here is what will go on the top of the profile page
  const options = { variables: { groupID: route.params.groupID }}
  const { data, loading, error } = useQuery<IGetFamilyPayload, IGetFamilyInput>(GET_FAMILY, options)
  console.log('my profile data', data);
  if ( error ) { console.log('error loading the profile')}

  return (
    <>
    {
      loading ? <ActivityIndicator /> : (
        <Profile
          mainUserID={route.params.groupID}
          family={data ? data.getFamily : []}
        />
      )
    }
    </>
  )
}

export default LiftedProfile;
