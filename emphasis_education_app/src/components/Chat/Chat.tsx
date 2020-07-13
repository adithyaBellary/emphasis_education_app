import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
import { useQuery, useSubscription } from '@apollo/react-hooks';

import Chat from './GiftedChat';
import Context from '../Context/Context';

import { REFETCH_LIMIT } from '../../constant';
import { IMessage, IMessageUserType } from '../../types';
import { SUB } from '../../queries/MessageReceived';

import { GET_MESSAGES } from '../../queries/GetMessages';

interface IChatProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

interface IState {
  messages: IMessage[];
}

interface IMessageReceivedProps {
  text: string;
  MessageId: number;
  createdAt: number;
  user: IMessageUserType;
  image?: string;
}

interface IMessageReceived {
  messageReceived: IMessageReceivedProps
}
interface IGetMessages {
  getMessages: IMessage[];
}

interface IGetMessagesInput {
  chatID: string;
  init: number;
}
let initFetch: number = 0;



const LiftedChat: React.FC<IChatProps> = props => {
  const { loggedUser } = React.useContext(Context);
  const [curState, setState] = useState<IState>();
  const chatID: string = props.route.params.chatID;
  console.log('chatID', chatID)
  // lets cache this data
  const { data: getMessages, loading: queryLoading, refetch, error: errorMessage } = useQuery<
      IGetMessages,
      IGetMessagesInput
    >(
    GET_MESSAGES,
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

  if (errorMessage) { console.log('error', errorMessage) }

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
    const { MessageId: _id, text, createdAt, user, image } = subData.messageReceived;
    if (!curState ) {
      setState({
        messages: [
          {
            _id,
            text,
            createdAt,
            user,
            image
          }
        ]
      })
      return
    }
    setState({
      messages: [
        ...curState.messages,
        {
          _id,
          text,
          createdAt,
          user,
          image
        }
      ]
    })
  }, [subData])

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
          <Chat
            queryLoading={queryLoading}
            refreshFn={refreshFn}
            chatID={chatID}
            curUser={curUser}
            messages={curState ? curState.messages : undefined}
          />
        )
      }
    </>
  )
}

export default LiftedChat;