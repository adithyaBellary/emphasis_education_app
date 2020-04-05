import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase';

// import firebaseSvc from '../service/FireBaseSvc';

interface IChatProps {
  // TODO should the ID be of type number or ID
  id: number;
  userName: string;
  email: string;
  navigation: any;
  route: any;
}

// interface IChatState {
//   // this should be of type Message
//   messages: Array<any>;
// }

const Chat: React.FC<IChatProps> = props => {
  // constructor (props: IChatProps) {
  //   super(props)
  // }

  // state = {
  //   messages: []
  // };

  // add hooks if youre real
  // componentDidMount() {
  //   this.setState({
  //     messages: [
  //       {
  //         _id: 1,
  //         text: 'this is a test message',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: 'Test User',
  //           avatar: 'https://placeimg.com/140/140/any'
  //         }
  //       },
  //       {
  //         _id: 2,
  //         text: 'this is another test message',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 3,
  //           name: 'diff Test User',
  //           // avatar: 'https://placeimg.com/140/140/any'
  //         }
  //       }
  //     ]
  //   })
  // }

  const messages =  [
    {
      _id: 1,
      text: 'this is a test message',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Test User',
        avatar: 'https://placeimg.com/140/140/any'
      }
    },
    {
      _id: 2,
      text: 'this is another test message',
      createdAt: new Date(),
      user: {
        _id: 3,
        name: 'diff Test User',
        // avatar: 'https://placeimg.com/140/140/any'
      }
    }
  ]

  const [curState, setState] = useState({messages})

  const user = () => {
    const { navigation, route } = props;

    // not sure what the type of these ids need to be
    const test: number = 1

    return {
      name: route.params.name,
      email: route.params.email,
      // id: firebaseSvc.uid(),
      // _id: firebaseSvc.uid()
      id: test,
      _id: test
    };
  }
  return (
    <GiftedChat
      messages={curState.messages}
      onSend={()=> console.log('send')}
      // we have a firebase.User if we need it
      user={user()}
    />
  )

}

export default Chat;
