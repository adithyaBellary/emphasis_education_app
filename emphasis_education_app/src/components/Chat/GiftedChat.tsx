import * as React from 'react';
import {
  Actions,
  ActionsProps,
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
  Message,
  MessageText,
  MessageImage,
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  Text
} from 'react-native';
import { Icon } from 'react-native-elements';
// import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';

import {decode, encode} from 'base-64'

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
  // const []
  const [image, setImage] = React.useState()

  const onSend = (props: IMessage[]) => {
    sendMessage({
      variables: {
        messages: [
          {
            id: 'messageID',
            text: props[0].text,
            user: curUser,
            chatID: chatID,
            image
          }
        ]
      }
    })
  }

  const renderBubble = (props) => (
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
          onPress={OpenImagePicker}
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

  // const OpenImagePicker = () => {
  //   console.log('picking')
  //   ImagePicker.openPicker({
  //     multiple: true,
  //     writeTempFile: true,
  //     includeBase64: true,
  //     includeExif: true
  //   }).then(_images => {
  //     console.log('images: ', _images)
  //   })
  // }

  const OpenImagePicker = () => {
    ImagePicker.showImagePicker( async response => {
      // console.log('reponse', response)
      // console.log('reponse', response.uri)

      if (response.didCancel) {
        console.log('cance')
      } else {
        try {
          const source = { uri: response.uri}
          // console.log('b64', response.data)
          // const localFIle = await fetch(response.uri)
          // const blob = await localFIle.blob()
          // console.log('blob', blob)
          setImage(response.data)

          const byteString = decode(response.data);
          const mimString = 'image/jpeg';
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }

          // write the Array Buffer to the blob
          const blob = new Blob([ia]);
          console.log('blob:', blob)
        } catch (e) {
          console.log('didnt work', e)
        }
      }
    })
  }

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
