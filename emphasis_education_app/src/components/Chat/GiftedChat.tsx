import * as React from 'react';
import { Actions, ActionsProps, GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  Text
} from 'react-native';
import { Icon } from 'react-native-elements';

import {
  IMessageUserType,
  IMessage
} from '../../types';
import { theme } from '../../theme';

interface IGiftedChatProps {
  queryLoading: boolean;
  // networkStatus: number;
  chatID: string;
  curUser: IMessageUserType;
  sendMessage: any;
  messages: IMessage[] | undefined;
  refreshFn(): void;
}

const MyGiftedChat: React.FC<IGiftedChatProps> = ({ queryLoading, refreshFn, chatID, curUser, sendMessage, messages }) => {

  const onSend = (props: IMessage[]) => {
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
  }

  const renderBubble = props => (
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
  );

  const renderComposer = props => (
    <Composer
      {...props}
      multiline={true}
      placeholder='Start typing your message here'
      textInputStyle={{
        fontFamily: theme.font.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )

  const renderActions = props => (
    <Actions
      {...props}
      containerStyle={{
        backgroundColor: 'grey',
      }}
      wrapperStyle={{
        backgroundColor: 'yellow'
      }}
      icon={() => (
        <Icon
          name='camerao'
          type='antdesign'
          onPress={() => console.log('hellooooo')}
        />
      )}
    />
  )

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      renderComposer={renderComposer}
      renderActions={renderActions}
    />
  )

  return (
    <GiftedChat
      renderLoading={() => <ActivityIndicator />}
      listViewProps={
        {
          refreshing: queryLoading,
          onRefresh: refreshFn
        }
      }
      renderChatEmpty={() => <Text>we empty</Text>}
      renderInputToolbar={renderInputToolbar}
      // renderComposer={renderComposer}
      // renderActions={}
      messages={messages}
      inverted={false}
      renderBubble={renderBubble}
      onSend={onSend}
      onLongPress={(ctx, currentMessage) => console.log('delete this', ctx, currentMessage)}
      user={curUser}
    />
  )
}

export default MyGiftedChat;
