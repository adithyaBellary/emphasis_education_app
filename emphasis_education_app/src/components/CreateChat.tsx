import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native';
import {
  Input, Icon
} from 'react-native-elements';
import { useLazyQuery } from '@apollo/react-hooks';


import { SEARCH_CLASSES } from '../queries/SearchClasses';
import { SEARCH_USERS } from '../queries/SearchUsers';
import { ISearchInput, ISearchClassesPayload, ISearchUserPayload } from '../types';
import { IndividualResultContainer } from './AdminPage/IndividualResult';

interface ICreateChatProps {
  navigation: any;
  route: any;
}

const CreateChat: React.FC<ICreateChatProps> = ({ navigation }) => {
  const [classSearch, setClassSearch] = React.useState('')
  const [userSearch, setUserSearch] = React.useState('')
  const [runClassSearchQuery, {data: classData, loading: classLoading, error: classError}] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const [selectedClasses, setSelectedClasses] = React.useState<string>()
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])
  const [selectedResults, setSelectedResults] = React.useState<string[]>([])

  React.useEffect(() => {
    runClassSearchQuery({variables: { searchTerm: classSearch}})
  }, [classSearch])
  React.useEffect(() => {
    runUserSearchQuery({variables: { searchTerm: userSearch}})
  }, [userSearch])

  // only set it to done when we have entered all the needed information
  navigation.setOptions({
    headerRight: () => (
      <Button
        title='Done'
        // onPress={() => Alert.alert('creating the chat')}
        onPress={() => console.log('creagting a new chat with', selectedUsers)}
        // TODO add disabled functionality
        // disabled={}
      />
    )
  })
  // pluscircleo
  // checkcircle
  console.log('user search', userData)
  console.log('class search', classData)

  const onUserTextChage = (text: string) => setUserSearch(text)
  const onClassTextChange = (text: string) => setClassSearch(text)

  const addSelectedUsers = (userID: string) => () =>  {
    // check if this user has been added already
    if (selectedUsers.includes(userID)) {
      Alert.alert('this user has already been added')
    } else {
      setSelectedUsers([...selectedUsers, userID])
      setSelectedResults([...selectedResults, userID])
    }
  }
  const addSelectedClasses = (className: string) => () => {
    // if there is already a class that is added, then we cannot add another one
    if (selectedClasses) {
      Alert.alert(`There is already a class added, ${selectedClasses}`)
    } else {
      setSelectedClasses(className)
    }
  }

  return (
    <>
      {/* we will leave it two individual input components for now */}
      <Input
        placeholder='Select Class'
        onChangeText={onClassTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      <Input
        placeholder='Select User'
        onChangeText={onUserTextChage}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      {/* let us display the results here so that we can easily have state over them */}
      { userLoading ? <ActivityIndicator /> : (
        userData ? userData.searchUsers.map((u, index) => (
          <TouchableOpacity
            onPress={addSelectedUsers(u._id)}
          >
            <IndividualResultContainer>
              <Text>{u.name}</Text>
              <Icon
                // name='pluscircleo'
                name={selectedResults.includes(u._id) ? 'checkcircle' : 'pluscircleo'}
                type='antdesign'
              />
            </IndividualResultContainer>
          </TouchableOpacity>
        )) : null
      )}
      { classLoading ? <ActivityIndicator /> : (
        classData ? classData.searchClasses.classes.map(c => (
          <TouchableOpacity
            onPress={addSelectedClasses(c)}
          >
            <Text>{c}</Text>
          </TouchableOpacity>
        )) : null
      )}
    </>
  )
}

export default CreateChat;
