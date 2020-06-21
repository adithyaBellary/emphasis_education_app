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
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { SEARCH_CLASSES } from '../queries/SearchClasses';
import { SEARCH_USERS } from '../queries/SearchUsers';
import { CREATE_CHAT } from '../queries/CreateChat';
import { ISearchInput, ISearchClassesPayload, ISearchUserPayload, ICreateChatInput, ICreateChatPayload, Permission } from '../types';
import { IndividualResultContainer } from './AdminPage/IndividualResult';

interface ICreateChatProps {
  navigation: any;
  route: any;
}

interface ISelectedUsersProps {
  _id: string;
  userType: string;
}

const CreateChat: React.FC<ICreateChatProps> = ({ navigation }) => {
  const [classSearch, setClassSearch] = React.useState('')
  const [userSearch, setUserSearch] = React.useState('')
  const [runClassSearchQuery, {data: classData, loading: classLoading, error: classError}] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const [selectedClasses, setSelectedClasses] = React.useState<string>('')
  const [selectedUsers, setSelectedUsers] = React.useState<ISelectedUsersProps[]>([])
  // const [selectedResults, setSelectedResults] = React.useState<string[]>([])

  const [createChatMutation, {data: dataCreateChat, loading: loadingCreateChat, error}] = useMutation<ICreateChatPayload, ICreateChatInput>(CREATE_CHAT);

  React.useEffect(() => {
    runClassSearchQuery({variables: { searchTerm: classSearch}})
  }, [classSearch])
  React.useEffect(() => {
    runUserSearchQuery({variables: { searchTerm: userSearch}})
  }, [userSearch])

  navigation.setOptions({
    headerRight: () => (
      <Button
        title='Done'
        onPress={createChat}
        // TODO add disabled functionality
        // disabled={}
      />
    )
  })

  const createChat = () => {
    console.log('creating a new chat with', selectedClasses, selectedUsers)
    // we need to get the
    let tutorEmail;
    let userEmails;

    // selectedResults.reduce((acc, current) => {
    //   if ()
    // }, [])
    // the selectedUsers field needs to know which ones are students and which one is the tutor
    // const _userEmails = sele

    const variables: ICreateChatInput = {
      displayName: 'Test Display Name',
      className: selectedClasses,
      tutorEmail: 'test01@gmail.com',
      userEmails: [
        'test02@gmail.com',
        'test03@gmail.com'
      ]
    }
    const options = { variables }
    createChatMutation(options)
    // or we could we make the selected users here
  }

  const onUserTextChage = (text: string) => setUserSearch(text)
  const onClassTextChange = (text: string) => setClassSearch(text)

  const addSelectedUsers = (userID: string, userType: string) => () =>  {
    let present = false;
    let _newArray = selectedUsers.reduce((acc, cur) => {
      if (cur._id === userID) {
        present = true;
        return acc
      } else {
        return [...acc, {_id: cur._id, userType: cur.userType}]
      }
    }, [] as ISelectedUsersProps[])
    if (!present) { _newArray = [..._newArray, {_id: userID, userType}] }
    setSelectedUsers([..._newArray])
  }

  const addSelectedClasses = (className: string) => () => {
    if (selectedClasses) {
      if (selectedClasses === className) {
        setSelectedClasses('')
      } else {
        setSelectedClasses(className)
      }
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
      <Text>Selected Class: {selectedClasses}</Text>
      <Text>Selected Users: {selectedUsers.map(u => `${u._id}, `)} </Text>
      {/* let us display the results here so that we can easily have state over them */}
      { userLoading ? <ActivityIndicator /> : (
        userData ? userData.searchUsers.map((u, index) => {
          let present = false;
          selectedUsers.forEach(_user => {
            if (_user._id === u._id) {
              present = true;
            }
          });
          return (
            <TouchableOpacity
              onPress={addSelectedUsers(u._id, u.userType)}
            >
              <IndividualResultContainer>
                <Text>{u.name}</Text>
                <Icon
                  name={present ? 'checkcircle' : 'pluscircleo'}
                  type='antdesign'
                />
              </IndividualResultContainer>
            </TouchableOpacity>
          )
        }) : null
      )}
      { classLoading ? <ActivityIndicator /> : (
        classData ? classData.searchClasses.classes.map(c => (
          <TouchableOpacity
            onPress={addSelectedClasses(c)}
          >
            <IndividualResultContainer>
            <Text>{c}</Text>
            <Icon
              name={selectedClasses === c ? 'checkcircle' : 'pluscircleo'}
              type='antdesign'
            />
            </IndividualResultContainer>
          </TouchableOpacity>
        )) : null
      )}
    </>
  )
}

export default CreateChat;
