import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  Text
} from 'react-native';
import {
  IMessageUserType,
  IMessage
} from '../Chat';

interface IGiftedChatProps {
  queryLoading: boolean;
  networkStatus: number;
  chatID: string;
  curUser: IMessageUserType;
  sendMessage: any;
  messages: IMessage[] | undefined;
  refreshFn(): void;
}


const MyGiftedChat: React.FC<IGiftedChatProps> = ({ queryLoading, networkStatus, refreshFn, chatID, curUser, sendMessage, messages }) => (
  <GiftedChat
    // what gets rendered when the messages are loading
    // get a loading spinner here
    renderLoading={() => <Text>render loading</Text>}
    // this is what is going to be sent to the FlatList in GiftedChat
    listViewProps={
      {
        // onEndReached: ()=> console.log('hit the end'),
        onEndReachedThreshold: 0.1,
        refreshing: queryLoading,
        // refreshing: networkStatus === 4 ? true : false,
        onRefresh: refreshFn
      }
    }
    renderChatEmpty={() => <Text>we empty</Text>}
    messages={messages}
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

export default MyGiftedChat;
