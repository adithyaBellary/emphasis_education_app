import * as React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Icon, Input } from 'react-native-elements';

import { ChatUserInfo, Permission } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers'
import { UserInfoType, Chat } from '../../../types/schema-types';
import {
  ContentContain,
  FONT_STYLES,
  GeneralSpacing,
  IconRow,
  LoadingComponent,
  PermissionedComponent,
  ThemedText,
} from '../shared';
import { ADD_CHAT_MEMBER } from '../../queries/AddChatMember';
import { IndividualResultContainer } from '../AdminPage/common';
import { GeneralContext } from '../Context/Context';
import { QuerySearchUsersArgs } from '../../../types/schema-types'

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

const SearchResults: React.FC<{
  email: string,
  results: UserInfoType[],
  addMember(email: string): () => void
}> = ({ email, results, addMember }) => (
  <View>
    {
      results.map(_result => (
        <IndividualResultContainer>
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            {_result.firstName} {_result.lastName}
          </ThemedText>
          <Icon
            name={_result.email === email ? 'checkcircle' : 'pluscircleo'}
            type='antdesign'
            onPress={addMember(_result.email)}
          />
        </IndividualResultContainer>
      ))
    }
  </View>
)
interface ChatInfoProps {
  navigation: any;
  route: any;
}

const checkEmail = (classes: Chat[] | undefined | null, email: string, chatID: string ): boolean => {
  if (!classes) {
    return false;
  }

  const curChat = classes.find(c => c.chatID === chatID);
  if (!curChat) {
    return false;
  }
  // check tutorInfo
  if (curChat.tutorInfo.email === email) {
    return false;
  }

  let present = true
  curChat.userInfo.forEach(_userInfo => {
    if(_userInfo.email === email) {
      present = false;
    }
  })
  // check userInfo

  return present

}

const ChatInfo: React.FC<ChatInfoProps> = ({ navigation, route }) => {
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;
  const chatID: string = route.params.chatID;

  const [click, setClick] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [stateEmail, setStateEmail] = React.useState<string | null>(null);
  const { loggedUser } = React.useContext(GeneralContext);

  const [runQuery, { data, loading, error }] = useLazyQuery<{ searchUsers: UserInfoType[] }, QuerySearchUsersArgs>(SEARCH_USERS)
  const [runMutation, {data: dataMutation, loading: loadingMutation}] = useMutation(ADD_CHAT_MEMBER);
  const onPress = () => setClick(click => !click)

  const searchChange = (term: string) => setSearchTerm(term)

  React.useEffect(() => {
    runQuery({ variables: {searchTerm, includeAdmin: false}})
  }, [searchTerm])

  const selectMember = (email: string) => () => {
    // let us check to make sure that the same user cannot be added 2x
    // get the chat object from the tutor
    console.log(loggedUser.classes)
    if (!checkEmail(loggedUser.classes, email, chatID)) {
      Alert.alert('you cannot select a user that is already added to this chat')
      // console.log('check failed')
      return
    }
    if (stateEmail === email) {
      setStateEmail(null)
    }
    setStateEmail(email)
  }

  const addMember = () => {
    runMutation({ variables: {
        email: stateEmail,
        chatID
      }})
      .then(res => {
        console.log('res after adding member, ', res)
        Alert.alert('Successfully added the user to the chat')
        navigation.goBack();
      })
      .catch(e => {
        console.log('there was an error running the mutation', e)
      })
  }

  return (
    <SafeAreaView>
      <IndividualResultContainer>
        <Cancel onPress={() => navigation.goBack()} />
        <Done onPress={() => addMember()} loading={loadingMutation} />

      </IndividualResultContainer>
      <ContentContain>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>
          Class Name: {className}
        </ThemedText>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>
          Tutor Name: {tutorInfo.firstName} {tutorInfo.lastName}
        </ThemedText>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>User(s)</ThemedText>
        {userInfo.map(_user => (
          <ThemedText size={14} type={FONT_STYLES.MAIN}>
            {_user.firstName} {_user.lastName}
          </ThemedText>
        ))}
        <PermissionedComponent allowedPermissions={[Permission.Admin]}>

        <IconRow>
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            Add member
          </ThemedText>
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={onPress}
          />
        </IconRow>
        {
          click && (
            <>
              <Input
                placeholder='Search users'
                onChangeText={searchChange}
                leftIcon={
                  <Icon
                    name='search'
                  />
                }
              />
              { loading ? <LoadingComponent loading={loading} /> : (
                  <SearchResults
                    email={stateEmail!}
                    results={data ? data.searchUsers : []}
                    addMember={selectMember}
                  />
              )}
            </>
          )
        }
        </PermissionedComponent>


      </ContentContain>

    </SafeAreaView>
  )
}

export default ChatInfo;
