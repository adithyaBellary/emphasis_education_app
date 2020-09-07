import * as React from 'react';
import {
  Actions,
  ActionsProps,
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { useMutation } from '@apollo/react-hooks';
import { SEND_MESSAGE } from '../../queries/SendMessage';
import {
  IMessageUserType,
  IMessage
} from '../../types';
import { theme } from '../../theme';
import { EmptyChat } from './common';

interface GiftedChatProps {
  queryLoading: boolean;
  // networkStatus: number;
  chatID: string;
  curUser: IMessageUserType;
  messages: IMessage[] | undefined;
  refreshFn(): void;
}

interface MessageReceivedProps {
  res: Boolean
}

interface MessagePayload {
  sendMessage: MessageReceivedProps;
}

const MyGiftedChat: React.FC<GiftedChatProps> = ({ queryLoading, refreshFn, chatID, curUser, messages }) => {
  const [image, setImage] = React.useState('')
  const [imageSelected, setImageSelected] = React.useState(false);

  const [sendMessage, { error }] = useMutation<MessagePayload>(
    SEND_MESSAGE,
    {
      onCompleted: data => {
        console.log('data after sending message', data)
        setImageSelected(false)
      }
    }
  );

  const onSend = (props: IMessage[]) => {
    console.log('curUser', curUser)
    console.log('chatID', chatID)
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
    <>
      {imageSelected && (
        <View style={{padding: 10}}>
          <TouchableHighlight onPress={() => Alert.alert('Remove the image?')}>
            <Image
              source={{uri: image}}
              style={{
                height: 75,
                width: 50
              }}
            />
          </TouchableHighlight>
        </View>
      )}
      <Composer
        {...props}
        multiline={true}
        placeholder='Start typing your message here'
        textInputStyle={{
          fontFamily: theme.font.main,
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          // backgroundColor: 'grey',
          // width: 10
        }}
      />
    </>
  )

  if (error) { console.log('there was an issue sending the message') }

  const renderActions = props => (
    <Actions
      {...props}
      containerStyle={{
        // backgroundColor: 'grey',
      }}
      wrapperStyle={{
        // backgroundColor: 'yellow'
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
      containerStyle={{
        // backgroundColor: 'yellow',
        borderRadius: 25,
        // padding: 10
        // margin: 10
      }}
    />
  )

  const options = {
    title: 'Select Photo to Send',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    permissionDenied: {
      title: 'Permission Denied',
      text: 'You have previously denied camera and/or photo library access permission. Please allow access to use this feature.',
      reTryTitle: 'Go To Permissions',
      okTitle: 'Cancel'
    }
  };

  const OpenImagePicker = () => {
    ImagePicker.showImagePicker( options, (response) => {
      if (response.didCancel) {
        console.log('cance')
      } else  if (response.error) {
        console.log('error', response.error)
      } else {
        try {
          console.log('setting the image', response)
          const _pre = `data:${response.type};base64,`;
          const source = `${_pre}${response.data}`
          setImage(source)
          setImageSelected(true)
        } catch (e) {
          console.log('didnt work', e)
        }
      }
    })
  }

  return (
    <>
    {/* <View style={{flex: 1}}> */}
    {/* <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={50}> */}
      <GiftedChat
        renderLoading={() => <ActivityIndicator animating={true} />}
        listViewProps={
          {
            refreshing: queryLoading,
            onRefresh: refreshFn,
            // marginBottom: 50
          }
        }
        renderChatEmpty={() => <EmptyChat />}
        renderInputToolbar={renderInputToolbar}
        messages={messages}
        inverted={false}
        renderBubble={renderBubble}
        onSend={onSend}
        onLongPress={(ctx, currentMessage) => console.log('delete this', ctx, currentMessage)}
        user={curUser}
        // keyboardShouldPersistTaps={'always'}
        // bottomOffset={60}
      />
      {/* </KeyboardAvoidingView> */}
      {/* <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={0}/> */}
    {/* </View> */}
    </>
  )
}

export default MyGiftedChat;
