import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
// import console = require('console');

interface IChatProps {
  // TODO should the ID be of type number or ID
  // id: number;
  // userName: string;
  // email: string;
  navigation: any;
  route: any;
}

const Chat: React.FC<IChatProps> = props => {
  const t: number = new Date().getTime();

  const messages =  [
    {
      _id: 1,
      text: 'this is a test message',
      createdAt: new Date().getTime(),
      user: {
        _id: "2",
        name: 'Test User',
        // avatar: 'https://placeimg.com/140/140/any'
      },
    },
    {
      _id: 2,
      text: 'this is another test message',
      createdAt: new Date().getTime(),
      user: {
        _id: "3",
        name: 'diff Test User',
        // avatar: 'https://placeimg.com/140/140/any'
      },
    }
  ]

  const [curState, setState] = useState({messages})

  const SEND_MESSAGE = gql`
    mutation sendMessage($messages: [MessageTypeInput]) {
      sendMessage(messages: $messages) {
        _id
        text
        MessageId
        name
      }
    }
  `;

  const [sendMessage, {loading, error}] = useMutation(
    SEND_MESSAGE,
    {
      onCompleted: ( props ) => {
        setState({
          messages: [
            ...curState.messages,
            {
              _id: props.sendMessage.MessageId,
              text: props.sendMessage.text,
              createdAt: new Date().getTime(),
              user: {
                _id: props.sendMessage._id,
                name: props.sendMessage.name
              },
            }
          ]
        })
      }
    }
  )

  if (error) console.log('ERROR in CHAT rip');

  interface IMessageUserType {
    _id: string,
    name: string,
    email: string
  }
  // create the user here in the useEffect
  const curUser: IMessageUserType = {
    _id: props.route.params._id,
    name: props.route.params.name,
    email: props.route.params.email,
  }

  return (
    <GiftedChat
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
        console.log(props)
        sendMessage({
          variables: {
            messages: [
              {
                // this works, but i am not too sure about it
                id: 'has to be a string',
                text: props[0].text,
                user: curUser
              }
            ]
          }
      })
      }}
      user={curUser}
    />
  )

}

export default Chat;
