import * as React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Alert
} from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Icon, Input } from 'react-native-elements';
import { ChatUserInfo, Permission } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers'
import { UserInfoType } from '../../../types/schema-types';

import {
  GeneralSpacing,
  ThemedText,
  IconRow,
  FONT_STYLES,
  ContentContain,
  PermissionedComponent
} from '../shared';
import { ADD_CHAT_MEMBER } from '../../queries/AddChatMember';

import { IndividualResultContainer } from '../AdminPage/IndividualResult';


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
        {
          loading && <ActivityIndicator animating={loading} />
        }
      </IconRow>
    </GeneralSpacing>
  </TouchableOpacity>
)

const SearchResults: React.FC<{
  results: UserInfoType[],
  addMember(email: string): () => void
}> = ({ results, addMember }) => (
  <View>
    {
      results.map(_result => (
        // <GeneralSpacing u={10} r={20} d={10} l={20}>
        <IndividualResultContainer>
          <Text>
            {_result.firstName} {_result.lastName}
          </Text>
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={addMember(_result.email)}
          />
          </IndividualResultContainer>
        // </GeneralSpacing>
      ))
    }
  </View>
)
interface ChatInfoProps {
  navigation: any;
  route: any;
}

const ChatInfo: React.FC<ChatInfoProps> = ({ navigation, route }) => {
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;
  const chatID: string = route.params.chatID;
  // console.log('chatID in chatINFO', chatID);

  const [click, setClick] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');


  const [runQuery, { data, loading, error }] = useLazyQuery<{ searchUsers: UserInfoType[] }>(SEARCH_USERS)
  const [runMutation, {data: dataMutation, loading: loadingMutation}] = useMutation(ADD_CHAT_MEMBER);
  const onPress = () => setClick(click => !click)

  const searchChange = (term: string) => setSearchTerm(term)

  React.useEffect(() => {
    runQuery({ variables: {searchTerm}})
  }, [searchTerm])

  const addMember = (email: string) => () => {
    console.log('params', email, chatID)
    runMutation({ variables: {
      email,
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
        <Done onPress={() => console.log('clicked')} loading={loadingMutation} />

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
          <Text>Add member</Text>
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
                placeholder='placeholding'
                onChangeText={searchChange}
                leftIcon={
                  <Icon
                    name='search'
                  />
                }
              />
              { loading ? <ActivityIndicator animating={loading} /> : (
                  <SearchResults
                    results={data ? data.searchUsers : []}
                    addMember={addMember}
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
