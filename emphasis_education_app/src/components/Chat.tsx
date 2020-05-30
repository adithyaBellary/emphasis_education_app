import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag'

import { REFETCH_LIMIT } from '../constant';
import GiftedChat from './Presentational/GiftedChat';
import Context from './Context/Context';
import { IMessage, IMessageUserType } from '../types';

interface IChatProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const SUB = gql`
  subscription {
    messageReceived {
      text
      MessageId
      createdAt
      user {
        name
        _id
      }
    }
  }
`

const SEND_MESSAGE = gql`
  mutation sendMessage($messages: [MessageInput]) {
    sendMessage(messages: $messages) {
      # id
      text
      MessageId
      createdAt
      user {
        name
        _id
      }
    }
  }
`;

const GetMessages = gql`
  query getMessages($chatID: String!, $init: Int!) {
    getMessages(chatID: $chatID, init: $init) {
      # id
      _id
      text
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

interface IState {
  messages: IMessage[];
}

interface IMessageReceived {
  text: string;
  MessageId: number;
  createdAt: number;
  user: IMessageUserType;
}
interface IGetMessages {
  getMessages: IMessage[];
}

interface IGetMessagesInput {
  chatID: string;
  init: number;
}
let initFetch: number = 0;


const Chat: React.FC<IChatProps> = props => {
  const { loggedUser } = React.useContext(Context);
  const [curState, setState] = useState<IState>()
  const chatID: string = props.route.params.chatID;

  // lets cache this data
  const { data: getMessages, loading: queryLoading, refetch, error: errorMessage,  } = useQuery<
      IGetMessages,
      IGetMessagesInput
    >(
    GetMessages,
    {
      variables: {
        chatID: chatID,
        init: initFetch
      },
      onCompleted: () => console.log('ran'),
      // need to look at this again
      fetchPolicy: 'no-cache',
    }
  )

  if (errorMessage) {
    console.log(errorMessage);
  }
  // TODO chatPicker might have to have state over this chat
  const { data: subData } = useSubscription<IMessageReceived>(SUB)

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
    console.log('resetting state', curState)
    if (!curState ) {
      setState({
        messages: [
          {
            _id: subData.messageReceived.MessageId,
            text: subData.messageReceived.text,
            createdAt: subData.messageReceived.createdAt,
            user: subData.messageReceived.user
          }
        ]
      })
      return
    }
    setState({
      messages: [
        ...curState.messages,
        {
          _id: subData.messageReceived.MessageId,
          text: subData.messageReceived.text,
          createdAt: subData.messageReceived.createdAt,
          user: subData.messageReceived.user
        }
      ]
    })
  }, [subData])
  // TODO type this mutation
  const [sendMessage, { error }] = useMutation(SEND_MESSAGE);

  if (error) {
    console.log('there was an error getting the messages')
    console.log(error)
  }

  const curUser: IMessageUserType = {
    _id: loggedUser._id,
    name: loggedUser.name,
    email: loggedUser.email,
  }

  const refreshFn = () => {
    console.log('refreshing')
    initFetch = initFetch + REFETCH_LIMIT;
    const variables = { chatID, init: initFetch}
    // check whether there are even messages for us to refresh w

    refetch(variables);
  }

  return (
    <>
      { queryLoading ?
        <Text>loading Gifted Chat</Text> :
        (
          <GiftedChat
            queryLoading={queryLoading}
            // networkStatus={networkStatus}
            refreshFn={refreshFn}
            chatID={chatID}
            curUser={curUser}
            sendMessage={sendMessage}
            messages={curState ? curState.messages : undefined}
          />
        )
      }
    </>
  )
}

export default Chat;
