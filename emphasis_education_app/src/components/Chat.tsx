import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

interface IChatProps {
  // TODO should the ID be of type number or ID
  id: number;
  userName: string;
  email: string;
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
        _id: 2,
        name: 'Test User',
        // avatar: 'https://placeimg.com/140/140/any'
      }
    },
    {
      _id: 2,
      text: 'this is another test message',
      createdAt: new Date().getTime(),
      user: {
        _id: 3,
        name: 'diff Test User',
        // avatar: 'https://placeimg.com/140/140/any'
      }
    }
  ]

  const [curState, setState] = useState({messages})

  const SEND_MESSAGE = gql`
    mutation sendMessage($messages: [MessageTypeInput]) {
      sendMessage(messages: $messages)
    }
  `;

  const [sendMessage, {loading, error}] = useMutation(
    SEND_MESSAGE,
    {
      onCompleted: ({ props }) => {
        // this should update the chat UI?
        console.log(props)
      }
    }
  )

  if (error) console.log('ERROR in CHAT rip');

  const user = () => {
    const { navigation, route } = props;

    // not sure what the type of these ids need to be
    const test: number = 1

    return {
      name: route.params.name,
      email: route.params.email,
      // id: firebaseSvc.uid(),
      // _id: firebaseSvc.uid()

      // query for this shit
      id: test,
      _id: test
    };
  }
  return (
    <GiftedChat
      messages={curState.messages}
      // onSend={(props)=> console.log(props)}
      onSend={(props) => {
        sendMessage({
          variables: {
            messages: [
              {
                id: 'props[0]._id',
                text: props[0].text,
                // createdAt: props[0].createdAt,
                user: {
                  // _id: props[0].user._id,
                  name: props[0].user.name,
                  email: 'test_email'
                }

              }
            ]
          }
      })
      }}
      // we have a firebase.User if we need it
      user={user()}
    />
  )

}

export default Chat;
