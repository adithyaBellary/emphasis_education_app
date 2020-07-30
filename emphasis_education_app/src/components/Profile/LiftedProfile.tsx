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
  IconRow,
  FONT_STYLES
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
      <ThemedText size={18} type={FONT_STYLES.MAIN}>
        {text}
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

const LiftedProfile: React.FC<ILiftedProfileProps> = ({ route, navigation }) => {
  console.log('route', route)
  const [editing, setEditing] = React.useState(false);
  const { loggedUser } = React.useContext(Context);
  // if we passed in routes then that means we have come from the admin page
  const groupID = route.params ? route.params.groupID : loggedUser.groupID
  const currentUserID = route.params ? route.params.currentUserID : loggedUser._id
  console.log('groupID', groupID)
  const options = { variables: { groupID }}
  const { data, loading, error } = useQuery<IGetFamilyPayload, IGetFamilyInput>(GET_FAMILY, options)
  if ( error ) { console.log('error loading the profile')}

  const toggleEdit = () => setEditing(_edit => !_edit)
  const goToAddMember = () => navigation.navigate('AddUserModal', { groupID })

  // let us not expose the profile editing yet

  // React.useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <>
  //         {
  //           !editing ? (
  //             <HeaderButtons text='Edit' onPress={toggleEdit} />
  //           ) : (
  //             <IconRow>
  //               <HeaderButtons text='Cancel' onPress={toggleEdit} />
  //               <HeaderButtons text='Done' onPress={toggleEdit} />
  //             </IconRow>
  //           )
  //         }
  //       </>
  //     )
  //   })
  // }, [editing])

  return (
    <>
    {
      loading ? <ActivityIndicator animating={loading} /> : (
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
