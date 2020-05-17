import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag'

import { REFETCH_LIMIT } from '../constant';

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
  mutation sendMessage($messages: [MessageTypeInput]) {
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
interface IMessage {
  _id: number;
  text: string;
  createdAt: number;
  user: IUser;
}

interface IState {
  messages: IMessage[]
}

const messages: IMessage[] =  [
  {
    _id: 100,
    text: 'test message',
    createdAt: new Date().getTime(),
    user: {
      _id: "2",
      name: 'Test User',
      email: 'test_email1',
      // avatar: 'https://placeimg.com/140/140/any'
    },
  },
  {
    _id: 200,
    text: 'aniother test message',
    createdAt: new Date().getTime(),
    user: {
      _id: "3",
      name: 'diff Test User',
      email: 'test_email1'
      // avatar: 'https://placeimg.com/140/140/any'
    },
  }
]

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

const Chat: React.FC<IChatProps> = props => {

  const [curState, setState] = useState<IState>({messages})
  const chatID: string = props.route.params.chatID;

  // lets cache this data
  const { data: getMessages, loading: queryLoading, refetch, error: errorMessage } = useQuery<
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
      fetchPolicy: 'no-cache'
    }
  )

  if (errorMessage) {
    console.log(errorMessage);
  }

  const { data: subData } = useSubscription<IMessageReceived>(SUB)

  // for the getMessage useEffect, we should add the results on top of the
  // what the currentstate is
  useEffect(() => {
    if (!getMessages) { return }
    console.log('getMessage', getMessages.getMessages.length)
    // setState({messages: getMessages.getMessages})
    setState({messages: [
      ...getMessages.getMessages,
      ...curState.messages
    ]})
  }, [getMessages])

  useEffect(() => {
    if (!subData) { return }
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

  interface IMessageUserType {
    _id: string,
    name: string,
    email: string
  }

  const curUser: IMessageUserType = {
    _id: props.route.params._id,
    name: props.route.params.name,
    email: props.route.params.email,
  }

  const refreshFn = () => {
    console.log('refreshing')
    // increment initFetch
    initFetch = initFetch + REFETCH_LIMIT + 1;
    const variables = { chatID, init: initFetch}
    refetch(variables);
  }

  return (
    <>
      { queryLoading ?
        <Text>loading Gifted Chat</Text> :
        (
        <GiftedChat
          // what gets rendered when the messages are loading
          // get a loading spinner here
          renderLoading={() => <Text>render loading</Text>}
          // this is what is going to be sent to the FlatList in GiftedChat
          listViewProps={
            {
              onEndReached: ()=> console.log('hit the end'),
              onEndReachedThreshold: 0.1,
              refreshing: queryLoading,
              onRefresh: refreshFn
            }
          }
          messages={curState.messages}
          inverted={false}
          renderBubble={(props) => (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: 'yellow',
                  fontFamily: 'Nunito'
                },
                left: {
                  fontFamily: 'Nunito'
                }
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: 'pink',
                },
                right: {
                  // backgroundColor: 'yellow'
                }
              }}
            />
          )}
          onSend={(props: IMessage[]) => {
            sendMessage({
              variables: {
                messages: [
                  {
                    // this works, but i am not too sure about it
                    id: 'messageID',
                    text: props[0].text,
                    user: curUser,
                    chatID: chatID
                  }
                ]
              }
            })
          }}
          user={curUser}
        />
        )
      }
    </>
  )
}

export default Chat;
