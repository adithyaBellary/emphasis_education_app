import * as React from 'react';
import {
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
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

const ChatPicker: React.FC<IChatPickerProps> = props => {

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
        {props.route.params.chatIDs.map((sub: string) => {
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
