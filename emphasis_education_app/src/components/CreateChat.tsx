import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  View
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

import Context from './Context/Context';

const Test: React.FC = () => (
  <View>
    <Text>
      hi
    </Text>
  </View>
)
interface ICreateChatProps {
  navigation: any;
  route: any;
}

interface ISelectedUsersProps {
  _id: string;
  email: string;
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

  const { setUser } = React.useContext(Context)

  const [createChatMutation, {data: dataCreateChat, loading: loadingCreateChat, error}] = useMutation<ICreateChatPayload, ICreateChatInput>(
    CREATE_CHAT,
    {
      onCompleted: () => {
        Alert.alert('chat successfully made')
        // update the user

      },
      onError: (e) => {
        console.log('error:', e)
      }
    }
  );

  React.useEffect(() => {
    runClassSearchQuery({variables: { searchTerm: classSearch }})
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
    try {
      let tutorEmail: string = ''
      const userEmails = selectedUsers.reduce<string[]>((acc, cur) => {
        if (cur.userType === Permission.Tutor) {
          if (!tutorEmail) {
            tutorEmail = cur.email
            console.log('setting', tutorEmail)
          }
          return acc
        } else {
          return [...acc, cur.email]
        }
      }, [] as string[])

      if (!tutorEmail) {throw Error}

      const variables: ICreateChatInput = {
        displayName: 'Test Display Name',
        className: selectedClasses,
        tutorEmail,
        userEmails
      }

      createChatMutation({
        variables
      })
    } catch(e) {
      Alert.alert('there was an error making this chat')
    }
  }

  const onUserTextChage = (text: string) => setUserSearch(text)
  const onClassTextChange = (text: string) => setClassSearch(text)

  const addSelectedUsers = (userID: string, userType: string, userEmail: string) => () =>  {
    let present = false;
    let _newArray = selectedUsers.reduce((acc, cur) => {
      if (cur._id === userID) {
        present = true;
        return acc
      } else {
        return [...acc, {_id: cur._id, userType: cur.userType, email: cur.email}]
      }
    }, [] as ISelectedUsersProps[])
    if (!present) { _newArray = [..._newArray, {_id: userID, userType, email: userEmail}] }
    console.log('_newArray', _newArray)
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
      <Text>Selected Users: {selectedUsers.map(u => `${u.email}, `)} </Text>
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
              onPress={addSelectedUsers(u._id, u.userType, u.email)}
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
