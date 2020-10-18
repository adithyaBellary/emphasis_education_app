import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  gql,
  useApolloClient,
  useQuery,
  useSubscription
} from '@apollo/client';
import * as Sentry from '@sentry/react-native';

import Chat from './GiftedChat';
import { GeneralContext } from '../Context/Context';

import { IMessage, IMessageUserType, ChatUserInfo } from '../../types';
import { QueryGetMessagesArgs } from '../../../types/schema-types';
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

interface MessageReceivedProps {
  text: string;
  MessageId: number;
  createdAt: number;
  user: IMessageUserType;
  image?: string;
}

interface MessageReceived {
  messageReceived: MessageReceivedProps
}
interface GetMessages {
  getMessages: IMessage[];
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
  const { data: getMessages, loading: queryLoading, refetch, error: errorMessage, updateQuery } = useQuery<
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
      onCompleted: () => console.log('ran the getmessages query'),
      // need to look at this again
      fetchPolicy: 'no-cache',
    }
  )

  if (errorMessage) { console.log('error', errorMessage) }

  const { data: subData } = useSubscription<MessageReceived>(SUB)

  useEffect(() => {
    if (!getMessages) { return }
    if (!curState) {
      setState({
        messages: getMessages.getMessages
      })
      return;
    }
    setState({messages: [
      ...getMessages.getMessages,
      ...curState.messages
    ]})
  }, [getMessages])

  useEffect(() => {
    if (!subData) { return }

    const { MessageId: _id, text, createdAt, user, image } = subData.messageReceived;
    let messages: IMessage[];
    let receivedMessage: IMessage = {
      _id,
      text,
      createdAt,
      user,
      image
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

  const curUser: IMessageUserType = {
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
