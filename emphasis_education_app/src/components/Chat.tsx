import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag'

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
  query getMessages($chatID: String) {
    getMessages(chatID: $chatID) {
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
    _id: 1,
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
    _id: 2,
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
}

const Chat: React.FC<IChatProps> = props => {

  const [curState, setState] = useState<IState>({messages})
  const chatID: string = props.route.params.chatID;

  // lets cache this data
  const { data: getMessages, loading: queryLoading, refetch } = useQuery<
      IGetMessages,
      IGetMessagesInput
    >(
    GetMessages,
    {
      variables: {
        chatID: chatID
      },
      // onCompleted: ( props ) => {
      //   console.log('query was complete')
      //   setState({messages: props.getMessages})
      // },
      // need to look at this again
      fetchPolicy: 'no-cache'
    }
  )

  const { data: subData, loading: subLoading } = useSubscription<IMessageReceived>(
    SUB,
    {
      // onSubscriptionData: (props) => {
      //   console.log('the returned data,',props.subscriptionData.data.messageReceived)
      //   setState({
      //     messages: [
      //       ...curState.messages,
      //       {
      //         _id: props.subscriptionData.data.messageReceived.MessageId,
      //         text: props.subscriptionData.data.messageReceived.text,
      //         createdAt: props.subscriptionData.data.messageReceived.createdAt,
      //         user: props.subscriptionData.data.messageReceived.user
      //       }
      //     ]
      //   })
      // }
    }
  )
  useEffect(() => {
    if (!getMessages) { return }
    setState({messages: getMessages.getMessages})
  }, [getMessages])

  useEffect(() => {
    if (!subData) { return }
    // console.log('subData', subData.messageReceived);
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

  return (
    <>
      { queryLoading ?
        <Text>loading Fifted CHat</Text> :
        (
        <GiftedChat
          // onLoadEarlier={() => console.log('i am loading earlier')}
          // loadEarlier={true}
          // what gets rendered when the messages are loading
          // get a loading spinner here
          renderLoading={() => <Text>render loading</Text>}
          // this is what is going to be sent to the FlatList in GiftedChat
          listViewProps={
            {
              onEndReached: ()=> console.log('hit the end'),
              onEndReachedThreshold: 0.1,
              refreshing: queryLoading,
              // run the refetch here
              onRefresh: () => console.log('refreshinggggg')
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
                    id: 'has to be a string',
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
