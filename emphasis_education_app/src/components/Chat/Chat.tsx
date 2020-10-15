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

import { REFETCH_LIMIT } from '../../constant';
import { IMessage, IMessageUserType, ChatUserInfo } from '../../types';
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

interface GetMessagesInput {
  chatID: string;
  init: number;
}

const query = gql`
  query GetMessages($chatID: String!, $init: Int!) {
    getMessages(chatID: $chatID, init: $init){
      _id
      text
      createdAt
      user {
        _id
        name
      }
      image
    }
  }
`

let initFetch: number = 0;
const LiftedChat: React.FC<ChatProps> = ({ navigation, route }) => {
  // now this is going to reset every time that we leave the chat and then come back in

  const { loggedUser } = React.useContext(GeneralContext);
  const [curState, setState] = useState<State>();
  const [messageFetchPointer, setMessageFetchPointer] = React.useState<number>(0);
  const chatID: string = route.params.chatID;
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;

  const client = useApolloClient();
  // console.log('tutor', tutorInfo)
  // console.log('user', userInfo)
  // lets cache this data
  const { data: getMessages, loading: queryLoading, refetch, error: errorMessage } = useQuery<
      GetMessages,
      GetMessagesInput
    >(
    GET_MESSAGES,
    {
      variables: {
        chatID: chatID,
        init: messageFetchPointer
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
      console.log('no cur state')
      setState({
        messages: getMessages.getMessages
      })
      return;
    }
    console.log('curstate')
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



    // console.log('messages being written', messages)

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

    // console.log('d', d)

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
    console.log('refreshing')
    initFetch = initFetch + REFETCH_LIMIT;
    // setMessageFetchPointer(messageFetchPointer + REFETCH_LIMIT)
    console.log('refetch', initFetch)
    // console.log('refetch limit', messageFetchPointer + REFETCH_LIMIT)
    const variables = { chatID, init: initFetch}
    // check whether there are even messages for us to refresh w

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
          // messages={getMessages ? getMessages.getMessages : []}
          // messages={[]}
        />
      )}
    </>
  )
}

export default LiftedChat;
