import React from 'react';
import {
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import styled from 'styled-components';

interface IChatPickerProps {
  chats: Array<any>;
  navigation: any;
  route: any;
}

const IndChat = styled(TouchableOpacity)`
  border: black;
  width: 100%;
  height: 30px;
`;

const ChatPicker: React.FC<IChatPickerProps> = props => {
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
            <IndChat>
              <Text>
                {sub}
              </Text>
            </IndChat>)
        })}
      </SafeAreaView>
    </>
  )
}

export default ChatPicker;