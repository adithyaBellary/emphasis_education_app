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

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { SEARCH_USERS } from '../../queries/SearchUsers';
import { CREATE_CHAT } from '../../queries/CreateChat';
import { ISearchInput, ISearchClassesPayload, ISearchUserPayload, ICreateChatInput, ICreateChatPayload, Permission } from '../../types';
import { IndividualResultContainer } from '../AdminPage/IndividualResult';

import { ChatUserInfo } from '../../types';
import {
  IconRow,
  GeneralSpacing,
  ThemedText,
  FONT_STYLES
} from '../shared';

interface CreateChatProps {
  navigation: any;
  route: any;
}

const ChatText: React.FC = ({ children }) => (
  <ThemedText
    size={14}
    type={FONT_STYLES.MAIN}
  >
    {children}
  </ThemedText>
)

// what if we just sent the email and name
interface SelectedUsersProps {
  _id: string;
  email: string;
  userType: string;
  firstName: string;
  lastName: string;
}

const CreateChat: React.FC<CreateChatProps> = ({ navigation }) => {
  const [classSearch, setClassSearch] = React.useState('')
  const [userSearch, setUserSearch] = React.useState('')
  const [runClassSearchQuery, {data: classData, loading: classLoading, error: classError}] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const [selectedClasses, setSelectedClasses] = React.useState<string>('')
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUsersProps[]>([])

  const [createChatMutation, {data: dataCreateChat, loading: loadingCreateChat, error}] = useMutation<ICreateChatPayload, ICreateChatInput>(
    CREATE_CHAT,
    {
      onCompleted: () => {
        Alert.alert('chat successfully made')
        navigation.goBack();
      },
      onError: (e) => {
        console.log('error:', e)
        Alert.alert('There was an error making the chat')
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
      <GeneralSpacing u={0} r={10} d={0} l={10}>
        <IconRow>
          <Button
            title='Done'
            onPress={createChat}
            // TODO add disabled functionality
            disabled={loadingCreateChat}
          />
          {loadingCreateChat && <ActivityIndicator animating={loadingCreateChat} />}
        </IconRow>
      </GeneralSpacing>
    )
  })


  const createChat = () => {
    console.log('creating a new chat with', selectedClasses, selectedUsers)
    try {
      let tutorEmail: string = '';
      let tutorFirstName: string = '';
      let tutorLastName: string = '';
      const userInfo = selectedUsers.reduce<ChatUserInfo[]>((acc, cur) => {
        if (cur.userType === Permission.Tutor) {
          if (!tutorEmail) {
            tutorEmail = cur.email
            tutorFirstName = cur.firstName
            tutorLastName = cur.lastName
            console.log('setting', tutorEmail)
          }
          return acc
        } else {
          const chatUserInfo: ChatUserInfo = {
            firstName: cur.firstName,
            lastName: cur.lastName,
            email: cur.email
          }
          return [...acc, chatUserInfo]
        }
      }, [] as ChatUserInfo[])

      if (!tutorEmail || !userInfo || !selectedClasses) {throw Error}
      const tutorInfo: ChatUserInfo = {
        firstName: tutorFirstName,
        lastName: tutorLastName,
        email: tutorEmail
      }
      console.log('tutor stuff', tutorInfo)
      console.log('user stuff', userInfo)
      const variables: ICreateChatInput = {
        displayName: 'Test Display Name',
        className: selectedClasses,
        userInfo,
        tutorInfo
      }
      console.log('variables: ', variables)
      createChatMutation({
        variables
      })
    } catch(e) {
      console.log('error', e)
      Alert.alert('Error creating this Chat. Please make sure that you have selected at least 1 tutor, 1 student, and a class')
    }
  }

  const onUserTextChage = (text: string) => setUserSearch(text)
  const onClassTextChange = (text: string) => setClassSearch(text)

  const addSelectedUsers = (userID: string, userType: string, userEmail: string, firstName: string, lastName: string) => () =>  {
    let present = false;
    let _newArray: SelectedUsersProps[] = selectedUsers.reduce((acc, cur) => {
      if (cur._id === userID) {
        present = true;
        return acc
      } else {
        return [...acc, {_id: cur._id, userType: cur.userType, email: cur.email, firstName: cur.firstName, lastName: cur.lastName}]
      }
    }, [] as SelectedUsersProps[])
    if (!present) { _newArray = [..._newArray, {_id: userID, userType, email: userEmail, firstName, lastName}] }
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
      <GeneralSpacing u={0} r={20} d={0} l={20}>
        <ChatText>Selected Class: {selectedClasses}</ChatText>
        <ChatText>Selected Users: {selectedUsers.map(u => `${u.firstName}, `)} </ChatText>
        {/* let us display the results here so that we can easily have state over them */}
        { userLoading ? <ActivityIndicator animating={userLoading} /> : (
          userData ? userData.searchUsers.map((u, index) => {
            let present = false;
            selectedUsers.forEach(_user => {
              if (_user._id === u._id) {
                present = true;
              }
            });
            return (
              <TouchableOpacity
                onPress={addSelectedUsers(u._id, u.userType, u.email, u.firstName, u.lastName)}
              >
                <IndividualResultContainer>
                  <ChatText>{u.firstName} {u.lastName}</ChatText>
                  <Icon
                    name={present ? 'checkcircle' : 'pluscircleo'}
                    type='antdesign'
                  />
                </IndividualResultContainer>
              </TouchableOpacity>
            )
          }) : null
        )}
        { classLoading ? <ActivityIndicator animating={classLoading} /> : (
          classData ? classData.searchClasses.classes.map(c => (
            <TouchableOpacity
              onPress={addSelectedClasses(c)}
            >
              <IndividualResultContainer>
                <ChatText>{c}</ChatText>
                <Icon
                  name={selectedClasses === c ? 'checkcircle' : 'pluscircleo'}
                  type='antdesign'
                />
              </IndividualResultContainer>
            </TouchableOpacity>
          )) : null
        )}
      </GeneralSpacing>
    </>
  )
}

export default CreateChat;
