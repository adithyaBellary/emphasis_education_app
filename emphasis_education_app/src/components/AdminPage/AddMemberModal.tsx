import * as React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  FONT_STYLES,
  GeneralSpacing,
  IconRow,
  LoadingComponent,
  ThemedText,
} from '../shared';
import { ISearchUserPayload, ISearchInput } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers';
import { ADD_FAMILY_MEMBER } from '../../queries/AddFamilyMember';
import { QuerySearchUsersArgs } from '../../../types/schema-types'

import { IndividualResultContainer } from './common';

interface CancelProps {
  onPress (): void;
}

// convert to SecondaryLink
const Cancel: React.FC<CancelProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type={FONT_STYLES.MAIN}>
        Cancel
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface DoneProps {
  loading: boolean;
  onPress (): void
}

const Done: React.FC<DoneProps> = ({ onPress, loading }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <IconRow>
        <ThemedText size={16} type={FONT_STYLES.MAIN}>
          Done
        </ThemedText>
        {loading && <LoadingComponent loading={loading} />}
      </IconRow>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface AddMemberProps {
  navigation: any;
  route: any;
}

const ContentContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={20} d={0} l={20}>
    {children}
  </GeneralSpacing>
);

// this can include just the name and the _id
interface SelectedUsersProps {
  _id: string;
  email: string;
  userType: string;
  name: string;
}

const AddMember: React.FC<AddMemberProps> = ({ navigation, route }) => {
  console.log('route', route)
  const [searchString, setSearchString] = React.useState('');
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, QuerySearchUsersArgs>(SEARCH_USERS)
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUsersProps[]>([])

  const [runMut, {data: mutationData, loading: mutationLoading, error: mutationError}] = useMutation(ADD_FAMILY_MEMBER)

  React.useEffect(() => {
    runUserSearchQuery({ variables: { searchTerm: searchString, includeAdmin: false}})
  }, [searchString])

  const onChangeText = (text: string) => setSearchString(text);

  const addSelectedUser = (userID: string, userType: string, userEmail: string, firstName: string, lastName: string) => () => {
    let present = false;
    let name = `${firstName} ${lastName}`;
    let _newArray = selectedUsers.reduce((acc, cur) => {
      if (cur._id === userID) {
        present = true;
        return acc
      } else {
        return [...acc, {_id: cur._id, userType: cur.userType, email: cur.email, name: cur.name}]
      }
    }, [] as SelectedUsersProps[])
    if (!present) { _newArray = [..._newArray, {_id: userID, userType, email: userEmail, name}] }
    setSelectedUsers([..._newArray])
  }

  const addMembers = () => {
    const options = {
      familyID: route.params.groupID,
      userEmails: selectedUsers.map(_user => _user.email)
    }
    runMut({ variables: options }).then(data => {
      console.log('data on done', data)
      Alert.alert('done adding this member')
      navigation.goBack()
    })
  }

  return (
    <GeneralSpacing u={0} r={15} d={0} l={15}>
    <SafeAreaView>
      <IndividualResultContainer>
        <Cancel onPress={() => navigation.goBack()}/>
        <Done onPress={addMembers} loading={mutationLoading} />
      </IndividualResultContainer>
      <Input
        placeholder='Search for Users'
        onChangeText={onChangeText}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      <ThemedText
        size={14}
        type={FONT_STYLES.MAIN}
      >
        Selected Users: {selectedUsers.map(_u => _u.name)},
      </ThemedText>
      <ContentContain>
        <ScrollView>
        {userLoading ? <LoadingComponent loading={userLoading} /> : (
          userData && userData.searchUsers.map(_user => {
            let present = false;
            selectedUsers.forEach(_u => {
              if (_u._id === _user._id) {
                present = true
              }
            })

            return (
              <TouchableOpacity
                onPress={addSelectedUser(_user._id, _user.userType, _user.email, _user.firstName, _user.lastName)}
              >
                <IndividualResultContainer>
                  <ThemedText
                    size={14}
                    type={FONT_STYLES.MAIN}
                  >
                    {_user.firstName} {_user.lastName}
                  </ThemedText>
                  <Icon
                    name={present ? 'checkcircle' : 'pluscircleo'}
                    type='antdesign'
                  />
                </IndividualResultContainer>
              </TouchableOpacity>
            )
          })
        ) }
        </ScrollView>
      </ContentContain>
    </SafeAreaView>
    </GeneralSpacing>
  )

};

export default AddMember;
