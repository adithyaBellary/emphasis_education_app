import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription
} from '@apollo/client';
import * as Sentry from '@sentry/react-native';
import { IMessage } from 'react-native-gifted-chat';
import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect } from '@react-navigation/native';

import Chat from './GiftedChat';
import { GeneralContext } from '../Context/Context';

import { ChatUserInfo } from '../../types';
import {
  MessageType,
  MessageUser,
  QueryGetMessagesArgs,
} from '../../../types/schema-types';
import { SUB } from '../../queries/MessageReceived';
import { GET_MESSAGES } from '../../queries/GetMessages';
import {
  CenteredDiv,
  FONT_STYLES,
  LoadingComponent,
  ThemedText,
} from '../shared';

interface ChatProps {
  navigation: any;
  route: any;
}

interface State {
  messages: IMessage[];
}

interface MessageReceived {
  messageReceived: MessageType
}
interface GetMessages {
  getMessages: MessageType[];
}

const LiftedChat: React.FC<ChatProps> = ({ navigation, route }) => {
  const { loggedUser, clearNotificationCounter } = React.useContext(GeneralContext);
  const [curState, setState] = useState<State>();
  const chatID: string = route.params.chatID;
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;
  // lets cache this data
  const {
    data: getMessages,
    loading: queryLoading,
    refetch,
    error: errorMessage,
    updateQuery,
    subscribeToMore
  } = useQuery<
      GetMessages,
      QueryGetMessagesArgs
    >(
    GET_MESSAGES,
    {
      variables: {
        chatID: chatID,
        userID: loggedUser._id,
        refresh: false

      },
      onError: (e) => crashlytics().log(`there was an error running the getMessages query ${e}`),
      fetchPolicy: 'no-cache',
    }
  )

  if (errorMessage) { console.log('errorrrrrrrrr', errorMessage) }

  const { data: subData, error: subError, loading: subLoading } = useSubscription<MessageReceived>(SUB, {
    // onSubscriptionData: (data) => {
    //   // console.log('got data', data)
    //   // console.log('got data in the sub!')
    // },
  })

  const isLoading = queryLoading;

  useEffect(() => {
    if (!getMessages) { return }
    crashlytics().log('successfully got the messages')
    const messages: IMessage[] = getMessages.getMessages.map(_message => {
      return {
        ..._message,
        createdAt: new Date(_message.createdAt)
      }
    })
    if (!curState) {
      setState({
        messages
      })
      return;
    }
    setState({messages: [
      ...messages,
      ...curState.messages
    ]})
  }, [getMessages])

  // here i need to check the chatID of the message received to make sure that I am
  // updating the correct chat UI.
  useEffect(() => {
    if (
      !subData ||
      subData.messageReceived.chatID !== chatID
    ) { return }

    let messages: IMessage[];
    let receivedMessage: IMessage = {
      ...subData.messageReceived,
      createdAt: new Date(subData.messageReceived.createdAt)
    }

    if (!curState ) {
      messages = [receivedMessage]
    } else {
      messages = [
        ...curState.messages,
        receivedMessage
      ]
    }

    setState({ messages })

  }, [subData])

  useEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity
            onPress={() => {
              if (className !== 'Admin Chat') {
                navigation.navigate(
                  'ChatInfo',
                  {
                    className,
                    tutorInfo,
                    userInfo,
                    chatID
                  }
                )
              }
            }}
          >
            <ThemedText size={20} type={FONT_STYLES.MAIN}>
              {className}
            </ThemedText>
          </TouchableOpacity>
        ),
        // headerBackTitle: className === 'Admin Chat' ? 'Admin Page' : 'Home'
      })
  }, [])

  React.useEffect(() => {
    clearNotificationCounter(chatID)
  }, [])

  const curUser: MessageUser = {
    _id: loggedUser._id,
    name: `${loggedUser.firstName} ${loggedUser.lastName}`,
    email: loggedUser.email,
  }

  const refreshFn = () => {
    const variables = {
      chatID,
      userID: loggedUser._id,
      refresh: true
    }

    refetch(variables);
  }

  return (
    <>
      {isLoading ? (
        <CenteredDiv>
          <LoadingComponent loading={isLoading} />
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            loading chat messages...
          </ThemedText>
        </CenteredDiv>
      ) : (
        <Chat
          queryLoading={queryLoading}
          refreshFn={refreshFn}
          chatID={chatID}
          curUser={curUser}
          messages={curState ? curState.messages : []}
          isAdminChat={className === 'Admin Chat'}
          // triggerSubToMore={() => {

          //   subscribeToMore({
          //     document: SUB,
          //     updateQuery: (prev, data) => {
          //       return prev;
          //     }
          //   })
          // }}
        />
      )}
    </>
  )
}

export default LiftedChat;
