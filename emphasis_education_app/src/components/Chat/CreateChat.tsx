import * as React from 'react';
import {
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Input, Icon
} from 'react-native-elements';
import { useLazyQuery, useMutation } from '@apollo/client';
import crashlytics from '@react-native-firebase/crashlytics';

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { SEARCH_USERS } from '../../queries/SearchUsers';
import { CREATE_CHAT } from '../../queries/CreateChat';
import {
  ISearchInput,
  ISearchClassesPayload,
  ISearchUserPayload,
  ICreateChatInput,
  ICreateChatPayload,
  Permission
} from '../../types';
import { IndividualResultContainer } from '../AdminPage/common';

import { ChatUserInfo } from '../../types';
import {
  FONT_STYLES,
  GeneralSpacing,
  IconRow,
  LoadingComponent,
  ThemedText,
  HorizontalDivider,
} from '../shared';
import { SearchResultsContain } from '../Search/common';
import { QuerySearchUsersArgs } from '../../../types/schema-types'

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
  const [runUserSearchQuery, {data: userData, loading: userLoading, error: userError}] = useLazyQuery<ISearchUserPayload, QuerySearchUsersArgs>(SEARCH_USERS)
  const [selectedClasses, setSelectedClasses] = React.useState<string>('')
  const [selectedUsers, setSelectedUsers] = React.useState<SelectedUsersProps[]>([])

  const [createChatMutation, {data: dataCreateChat, loading: loadingCreateChat, error}] = useMutation<ICreateChatPayload, ICreateChatInput>(
    CREATE_CHAT,
    {
      onCompleted: () => {
        Alert.alert('Chat successfully made!')
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
    runUserSearchQuery({
      variables: {
        searchTerm: userSearch,
        includeAdmin: true
      }
    })
  }, [userSearch])

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <GeneralSpacing u={0} r={10} d={0} l={10}>
          <IconRow>
            <Button
              title='Done'
              onPress={createChat}
              disabled={loadingCreateChat}
            />
            {loadingCreateChat && <LoadingComponent loading={loadingCreateChat} />}
          </IconRow>
        </GeneralSpacing>
      ),
      headerBackTitle: 'Chats'
    })
  })

  const createChat = () => {
    try {
      let tutorEmail: string = '';
      let tutorFirstName: string = '';
      let tutorLastName: string = '';

      const userInfo: ChatUserInfo[] = selectedUsers.reduce<ChatUserInfo[]>((acc, cur) => {
        if (cur.userType === Permission.Tutor || cur.userType === Permission.Admin) {
          if (!tutorEmail) {
            tutorEmail = cur.email
            tutorFirstName = cur.firstName
            tutorLastName = cur.lastName
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

      if (!tutorEmail || userInfo.length == 0 || !selectedClasses) {throw Error}
      const tutorInfo: ChatUserInfo = {
        firstName: tutorFirstName,
        lastName: tutorLastName,
        email: tutorEmail
      }

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
      crashlytics().log('successfully created a chat')
    } catch(e) {
      Alert.alert('Error creating this Chat. Please make sure that you have selected at least 1 tutor, 1 student or parent, and a class')
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
      <Input
        placeholder='Select User'
        onChangeText={onUserTextChage}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      <Input
        placeholder='Select Class'
        onChangeText={onClassTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      <GeneralSpacing u={0} r={20} d={10} l={20}>
        <ChatText>Selected Users: {selectedUsers.map(u => `${u.firstName}, `)}</ChatText>
        <ChatText>Selected Class: {selectedClasses}</ChatText>
      </GeneralSpacing>
      <SearchResultsContain>
        { userLoading ? <LoadingComponent loading={userLoading} /> : (
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
                key={u._id}
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
        <HorizontalDivider width={100} color={'grey'}/>
        { classLoading ? <LoadingComponent loading={classLoading} /> : (
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
      </SearchResultsContain>
    </>
  )
}

export default CreateChat;
