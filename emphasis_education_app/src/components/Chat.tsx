import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag'

import { REFETCH_LIMIT } from '../constant';
import GiftedChat from './Presentational/GiftedChat';

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

interface IUser {
  _id: string;
  name: string;
  email: string;
}

// rn gifted chat also has its own IMessage type that we can use
export interface IMessage {
  _id: number;
  text: string;
  createdAt: number;
  user: IUser;
}

interface IState {
  messages: IMessage[];
}

interface IMessageReceived {
  text: string;
  MessageId: number;
  createdAt: number;
  user: IUser;
}
interface IGetMessages {
  getMessages: IMessage[];
}

interface IGetMessagesInput {
  chatID: string;
  init: number;
}
let initFetch: number = 0;

export interface IMessageUserType {
  _id: string,
  name: string,
  email: string
}

const Chat: React.FC<IChatProps> = props => {

  // let use make out our hook here
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

  // for the getMessage useEffect, we should add the results on top of the
  // what the currentstate is
  useEffect(() => {
    if (!getMessages) { return }
    console.log('getMessage', getMessages.getMessages.length)
    // console.log('curstate', curState);
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
    _id: props.route.params._id,
    name: props.route.params.name,
    email: props.route.params.email,
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
