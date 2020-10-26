import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription
} from '@apollo/client';
import * as Sentry from '@sentry/react-native';
import { IMessage } from 'react-native-gifted-chat';

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
  ThemedText,
  FONT_STYLES,
  CenteredDiv
} from '../shared';

interface ChatProps {
  navigation: any;
  route: any;
}

interface State {
  messages: IMessage[];
}

// interface MessageReceivedProps {
//   text: string;
//   MessageId: number;
//   createdAt: number;
//   user: IMessageUserType;
//   image?: string;
// }

interface MessageReceived {
  messageReceived: MessageType
}
interface GetMessages {
  getMessages: MessageType[];
}

// const query = gql`
//   query GetMessages($chatID: String!, $init: Int!) {
//     getMessages(chatID: $chatID, init: $init){
//       _id
//       text
//       createdAt
//       user {
//         _id
//         name
//       }
//       image
//     }
//   }
// `

const LiftedChat: React.FC<ChatProps> = ({ navigation, route }) => {
  const { loggedUser } = React.useContext(GeneralContext);
  const [curState, setState] = useState<State>();
  const chatID: string = route.params.chatID;
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;

  // const client = useApolloClient();
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
      // onCompleted: () => console.log('ran the getmessages query'),
      onError: (e) => console.log('there was an error running the getMessages query', e),
      // need to look at this again
      fetchPolicy: 'no-cache',
    }
  )

  if (errorMessage) { console.log('errorrrrrrrrr', errorMessage) }

  const { data: subData, error: subError, loading: subLoading } = useSubscription<MessageReceived>(SUB, {
    onSubscriptionData: (data) => {
      console.log('got data', data)

      Sentry.captureMessage('Message received sub got data', {
        user: {
          email: loggedUser.email,
          username: `${loggedUser.firstName} ${loggedUser.lastName}`
        }
      })
    },
  })

  if (subError) {
    console.log('error in subscription', subError)
    Sentry.captureException(subError, {
      user: {
        email: loggedUser.email,
        error: subError
      }
    })
    Sentry.captureMessage(subError.toString(), {
      user: {
        email: loggedUser.email,
        error: subError
      }
    })
  }

  if (subLoading) {
    console.log('subscription is loading')
  }

  useEffect(() => {
    if (!getMessages) { return }
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

  useEffect(() => {
    if (!subData) { return }

    let messages: IMessage[];
    let receivedMessage: IMessage = {
      ...subData.messageReceived,
      createdAt: new Date(subData.messageReceived.createdAt)
    }

    Sentry.captureMessage('Received a message in chat', {
      user: {
        email: loggedUser.email,
        username: `${loggedUser.firstName} ${loggedUser.lastName}`
      }
    })

    if (!curState ) {
      messages = [receivedMessage]
    } else {
      messages = [
        ...curState.messages,
        receivedMessage
      ]
    }

    // it is mentioned in the documentation that changes to the cache will not be reflected in the server, but that is fine
    // const d = client.readQuery({
    //   query,
    //   variables: {
    //     chatID,
    //     init: 0
    //   }
    // })
    // client.writeQuery({
    //   query,
    //   data: {
    //     getMessages: [...d.getMessages, receivedMessage]
    //     // getMessages: [...messages, receivedMessage]
    //   },
    //   variables: {
    //     chatID,
    //     init: 0
    //   }
    // })

    setState({ messages })

  }, [subData])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ChatInfo', { className, tutorInfo, userInfo, chatID })}>
          <ThemedText size={20} type={FONT_STYLES.MAIN}>
            {className}
          </ThemedText>
        </TouchableOpacity>
      )
    })
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
      { queryLoading ? (
        <CenteredDiv>
          <ActivityIndicator animating={queryLoading} />
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
        />
      )}
    </>
  )
}

export default LiftedChat;
