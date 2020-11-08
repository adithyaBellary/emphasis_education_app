import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';

import { GeneralContext } from '../Context/Context';
import Profile from './Profile';

import { GET_FAMILY } from '../../queries/GetFamily';
import { IGetFamilyInput } from '../../types';
import {
  CenteredDiv,
  FONT_STYLES,
  GeneralSpacing,
  LoadingComponent,
  ThemedText,
} from '../shared';
import { UserInfoType } from '../../../types/schema-types';

interface LiftedProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

interface HeaderButtonProps {
  text: string;
  onPress(): void;
}

const HeaderButtons: React.FC<HeaderButtonProps> = ({ text, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={0} r={20} d={0} l={0}>
      <ThemedText size={18} type={FONT_STYLES.MAIN}>
        {text}
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

const LiftedProfile: React.FC<LiftedProfileProps> = ({ route, navigation }) => {
  const [editing, setEditing] = React.useState(false);
  const { loggedUser } = React.useContext(GeneralContext);
  // if we passed in routes then that means we have come from the admin page
  const groupID = route.params ? route.params.groupID : loggedUser.groupID
  const currentUserID = route.params ? route.params.currentUserID : loggedUser._id
  // console.log('groupID', groupID)
  const { data, loading, error } = useQuery<{ getFamily: UserInfoType[] }, IGetFamilyInput>(
    GET_FAMILY,
    {
      variables: {
        groupID
      },
      fetchPolicy: 'no-cache'
    }
  )
  if ( error ) { console.log('error loading the profile', error)}
  const goToAddMember = () => navigation.navigate('AddUserModal', { groupID })

  return (
    <>
    {
      loading ? (
        <CenteredDiv>
          <LoadingComponent loading={loading} />
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            loading profile page...
          </ThemedText>
        </CenteredDiv>
        ) : (
        <Profile
          currentUserID={currentUserID}
          family={data ? data.getFamily : []}
          editing={editing}
          onPress={goToAddMember}
        />
      )
    }
    </>
  )
}

export default LiftedProfile;
