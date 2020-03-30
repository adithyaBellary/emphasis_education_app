import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

import firebaseSvc from '../../FireBaseSvc';

interface IChatProps {
  // TODO should the ID be of type number or ID
  id: number;
  name: string;
  email: string;
  subject: string;
  navigation: any;
}

interface IChatState {
  // this should be of type Message
  messages: Array<any>;
}

const test_user = {
  name: 'test user',
  email: 'test@gmail.com'
}
class Chat extends React.Component<IChatProps, IChatState> {
  constructor (props: IChatProps) {
    super(props)
  }

  state = {
    messages: []
  };

  // add hooks if youre real
  componentDidMount() {
    this.setState({
      messages: [
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
    })
  }

  user() {
    return {
      name: this.props.name,
      email: this.props.email,
      id: firebaseSvc.uid(),
      _id: firebaseSvc.uid()
    };
  }

  public render () {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={{
          _id: 1,
          // name: 'another test'
        }}
      />
    )
  }
}

export default Chat;
