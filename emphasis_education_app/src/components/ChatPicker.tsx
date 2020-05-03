import React from 'react';
import {
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  GestureResponderEvent
} from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import styled from 'styled-components';

interface IChatPickerProps {
  // chats: Array<any>;
  navigation: any;
  route: any;
}

const IndChat = styled(TouchableOpacity)`
  border: black;
  width: 100%;
  height: 30px;
`;

// this query should only fetch the last N messages

const GetMessages = gql`
{
  getMessages(id: $id) {
    text
  }
}
`;

const ChatPicker: React.FC<IChatPickerProps> = props => {
  // seems like a good idea to use the useLazyQuery here and then query for the data on buttonCLick

  const goToChat = (sub: string) => async () => {
    props.navigation.navigate(
      'Chat',
      {
        chatID: sub,
        name: props.route.params.name,
        email: props.route.params.email,
        _id: props.route.params._id
      }
    )
  }
  // add dropdown functionality
  console.log(props.route.params.chatIDs);
  return (
    <>
      <SafeAreaView>
        <IndChat
          onPress={() => Alert.alert('going to the chat')}
        >
          <Text>
          Math
          </Text>

        </IndChat>
        <IndChat
          onPress={() => Alert.alert('going to the chat')}
        >
        <Text>
          History
        </Text>
        </IndChat>
        {props.route.params.chatIDs.map((sub) => {
          return (
            <IndChat
              onPress={goToChat(sub)}
              key={sub}
            >
              <Text>
                {sub}
              </Text>
            </IndChat>
            )
        })}
      </SafeAreaView>
    </>
  )
}

export default ChatPicker;