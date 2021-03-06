import * as React from 'react';
import { useMutation } from '@apollo/client';
import {
  Actions,
  ActionsProps,
  Bubble,
  BubbleProps,
  Composer,
  ComposerProps,
  GiftedChat,
  InputToolbar,
  InputToolbarProps,
  IMessage,
} from 'react-native-gifted-chat';
import {
  Alert,
  Image,
  TouchableHighlight,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import crashlytics from '@react-native-firebase/crashlytics';

import { SEND_MESSAGE } from '../../queries/SendMessage';
import { MessageType, MessageUser } from '../../../types/schema-types';
import { theme } from '../../theme';
import { LoadingComponent } from '../shared'

import { EmptyChat } from './common';

interface GiftedChatProps {
  queryLoading: boolean;
  chatID: string;
  curUser: MessageUser;
  messages: IMessage[] | undefined;
  isAdminChat: boolean;
  refreshFn(): void;
  // triggerSubToMore (): void;
}

interface MessageReceivedProps {
  res: Boolean
}

interface MessagePayload {
  sendMessage: MessageReceivedProps;
}

const right = {
  color: 'yellow',
  fontFamily: 'Nunito'
}

const left = {
  fontFamily: 'Nunito'
}

const renderBubble = (props: BubbleProps<IMessage>) => (

  <Bubble
    {...props}
    textStyle={{
      right,
      left
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
  )


const MyGiftedChat: React.FC<GiftedChatProps> = ({
  queryLoading,
  refreshFn,
  chatID,
  isAdminChat,
  curUser,
  messages,
  // triggerSubToMore
}) => {
  const [image, setImage] = React.useState('')
  const [imageSelected, setImageSelected] = React.useState(false);

  // React.useEffect(() => {
  //   triggerSubToMore();
  // }, [])

  const [sendMessage, { data, error }] = useMutation<MessagePayload>(
    SEND_MESSAGE,
    {
      onCompleted: data => {
        // console.log('data after sending message', data)
        setImageSelected(false)
      }
    }
  );

  const onSend = (props: IMessage[]) => {
    // console.log('the current user on send', curUser)
    // console.log('chatID', chatID)
    crashlytics().log('sent a message')
    sendMessage({
      variables: {
        messages: [
          {
            // delete the id param here
            id: 'messageID',
            text: props[0].text,
            user: curUser,
            chatID: chatID,
            image
          }
        ],
        isAdminMessage: isAdminChat
      }
    })
  }

  const renderComposer = (props: ComposerProps) => (
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
          fontFamily: theme.font.main
        }}
      />
    </>
  )

  // if (data) { console.log('data', data)}
  if (error) {
    crashlytics().log(`there was an issue sending the message ${error}`)
    console.log('there was an issue sending the message', error)
  }

  const renderActions = (props: ActionsProps) => (
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

  const renderInputToolbar = (props: InputToolbarProps) => (
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
        // console.log('cance')
      } else  if (response.error) {
        console.log('error', response.error)
        crashlytics().log('error setting the image (response)')
      } else {
        try {
          // console.log('setting the image', response)
          const _pre = `data:${response.type};base64,`;
          const source = `${_pre}${response.data}`
          setImage(source)
          setImageSelected(true)
        } catch (e) {
          console.log('didnt work', e)
          crashlytics().log('could not set the image for some reason')
        }
      }
    })
  }

  return (
    <GiftedChat
      renderLoading={() => <LoadingComponent loading={true} />}
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
    />
  )
}

export default MyGiftedChat;
