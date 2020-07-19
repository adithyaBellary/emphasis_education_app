import * as React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import Context from '../Context/Context';
import Profile from './Profile';

import { GET_FAMILY } from '../../queries/GetFamily';
import { IGetFamilyInput, IGetFamilyPayload } from '../../types';
import {
  GeneralSpacing,
  ThemedText,
  IconRow
} from '../shared';

interface ILiftedProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

interface IHeaderButtonProps {
  text: string;
  onPress(): void;
}

const HeaderButtons: React.FC<IHeaderButtonProps> = ({ text, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={0} r={20} d={0} l={0}>
      <ThemedText size={18} type='main'>
        {text}
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

const LiftedProfile: React.FC<ILiftedProfileProps> = ({ route, navigation }) => {
  const [editing, setEditing] = React.useState(false);
  console.log('route in profile', route)
  const mainUserID: string = route.params.groupID
  // what i get passed here is what will go on the top of the profile page
  const options = { variables: { groupID: mainUserID }}
  const { data, loading, error } = useQuery<IGetFamilyPayload, IGetFamilyInput>(GET_FAMILY, options)
  console.log('my profile data', data);
  if ( error ) { console.log('error loading the profile')}
  const toggleEdit = () => setEditing(_edit => !_edit)

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {
            !editing ? (
              <HeaderButtons text='Edit' onPress={toggleEdit}/>
            ) : (
              <IconRow>
                <HeaderButtons text='Cancel' onPress={toggleEdit} />
                <HeaderButtons text='Done' onPress={toggleEdit}/>
              </IconRow>
            )
          }
        </>
      )
    })
  }, [editing])

  return (
    <>
    {
      loading ? <ActivityIndicator /> : (
        <Profile
          mainUserID={mainUserID}
          family={data ? data.getFamily : []}
          editing={editing}
        />
      )
    }
    </>
  )
}

export default LiftedProfile;
