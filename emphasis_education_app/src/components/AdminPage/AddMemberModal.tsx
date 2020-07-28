import * as React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import UserSearch from './LiftedSearch';

import { GeneralSpacing, ThemedText, IconRow } from '../shared';
import { ISearchUserPayload, ISearchInput } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers';
import { IndividualResultContainer } from './IndividualResult';

import { ADD_FAMILY_MEMBER } from '../../queries/AddFamilyMember';

interface ICancelProps {
  onPress (): void;
}

// convert to SecondaryLink
const Cancel: React.FC<ICancelProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type='main'>
        Cancel
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface IDoneProps {
  loading: boolean;
  onPress (): void
}

const Done: React.FC<IDoneProps> = ({ onPress, loading }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <IconRow>
        <ThemedText size={16} type='main'>
          Done
        </ThemedText>
        {
          loading && <ActivityIndicator animating={loading} />
        }
      </IconRow>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface IAddMemberProps {
  navigation: any;
  route: any;
}

const ContentContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={20} d={0} l={20}>
    {children}
  </GeneralSpacing>
);

// this can include just the name and the _id
interface ISelectedUsersProps {
  _id: string;
  email: string;
  userType: string;
  name: string;
}

const AddMember: React.FC<IAddMemberProps> = ({ navigation, route }) => {
  console.log('route', route)
  const [searchString, setSearchString] = React.useState('');
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const [selectedUsers, setSelectedUsers] = React.useState<ISelectedUsersProps[]>([])

  const [runMut, {data: mutationData, loading: mutationLoading, error: mutationError}] = useMutation(ADD_FAMILY_MEMBER)

  React.useEffect(() => {
    runUserSearchQuery({ variables: { searchTerm: searchString}})
  }, [searchString])

  const onChangeText = (text: string) => setSearchString(text);

  const addSelectedUser = (userID: string, userType: string, userEmail: string, firstName: string, lastName: string) => () => {
    let present = false;
    let _newArray = selectedUsers.reduce((acc, cur) => {
      if (cur._id === userID) {
        present = true;
        return acc
      } else {
        return [...acc, {_id: cur._id, userType: cur.userType, email: cur.email, name: cur.name}]
      }
    }, [] as ISelectedUsersProps[])
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
    })
  }

  return (
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
      <Text>Selected Users: {selectedUsers.map(_u => _u.name)}, </Text>
      <ContentContain>
        {userLoading ? <ActivityIndicator animating={userLoading} /> : (
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
                  <Text>{_user.firstName} {_user.lastName}</Text>
                  <Icon
                    name={present ? 'checkcircle' : 'pluscircleo'}
                    type='antdesign'
                  />
                </IndividualResultContainer>
              </TouchableOpacity>
            )
          })
        ) }
      </ContentContain>
    </SafeAreaView>
  )

};

export default AddMember;
