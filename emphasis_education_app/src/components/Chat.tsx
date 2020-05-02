import React, { useState, useEffect } from 'react';
import {
  Text
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'

interface IChatProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const SEND_MESSAGE = gql`
  mutation sendMessage($messages: [MessageTypeInput]) {
    sendMessage(messages: $messages) {
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
{
  getMessages(id: "test") {
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
    text: 'this is a test message',
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
    text: 'this is another test message boiiiii',
    createdAt: new Date().getTime(),
    user: {
      _id: "3",
      name: 'diff Test User',
      email: 'test_email1'
      // avatar: 'https://placeimg.com/140/140/any'
    },
  }
]

const Chat: React.FC<IChatProps> = props => {

  const [curState, setState] = useState<IState>({messages})
  const chatID: string = props.route.params.chatID;

  const { data, loading } = useQuery(
    GetMessages,
    {
      variables: {
        id: "test"
      },
      onCompleted: ( props ) => {
        setState({
          messages: props.getMessages,
        })
      }
    }
  )

  // debugger;

  const [sendMessage, { error }] = useMutation(
    SEND_MESSAGE,
    {
      onCompleted: ( props ) => {

        console.log(props)
        console.log(curState)
        setState({
          messages: [
            ...curState.messages,
            {
              _id: props.sendMessage.MessageId,
              text: props.sendMessage.text,
              createdAt: props.sendMessage.createdAt,
              user: props.sendMessage.user
            }
          ]
        })
      }
    }
  )

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
    { loading ? <Text>loading</Text> :
    (<GiftedChat
      messages={curState.messages}
      inverted={false}
      renderBubble={(props) => (
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: 'yellow',
            },
            left: {}
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
      onSend={(props) => {
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
    />)
    }
    </>
  )

}

export default Chat;
