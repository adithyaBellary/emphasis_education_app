import * as React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  Text
} from 'react-native';
import {
  IMessageUserType,
  IMessage
} from '../../types';

interface IGiftedChatProps {
  queryLoading: boolean;
  // networkStatus: number;
  chatID: string;
  curUser: IMessageUserType;
  sendMessage: any;
  messages: IMessage[] | undefined;
  refreshFn(): void;
}


const MyGiftedChat: React.FC<IGiftedChatProps> = ({ queryLoading, refreshFn, chatID, curUser, sendMessage, messages }) => (
  <GiftedChat
    renderLoading={() => <ActivityIndicator />}
    listViewProps={
      {
        refreshing: queryLoading,
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
    onLongPress={(ctx, currentMessage) => console.log('delete this', ctx, currentMessage)}
    user={curUser}
  />
)

export default MyGiftedChat;
