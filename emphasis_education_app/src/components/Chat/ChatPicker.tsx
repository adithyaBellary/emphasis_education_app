import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useLazyQuery } from '@apollo/react-hooks';
import messaging from '@react-native-firebase/messaging';

import { GeneralContext } from '../Context/Context';
import {
  PermissionedComponent,
  IconRow,
  GeneralSpacing,
} from '../shared';
import { GET_USER } from '../../queries/GetUser';
import { Permission, ChatUserInfo, } from '../../types';

import { EmptyChatPicker } from './common';
import IndividualChat from './IndividualChat';

interface IChatPickerProps {
  navigation: any;
  route: any;
}

export const ChatsContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={10} d={0} l={10}>
    {children}
  </GeneralSpacing>
);

const ChatPicker: React.FC<IChatPickerProps> = ({ navigation }) => {
  const { loggedUser, setUser, notifications, clearNotificationCounter } = React.useContext(GeneralContext);
  console.log('notifications badge', notifications);
  // console.log('logged user in chat picker', loggedUser);
  const [runQ, { data, loading, error}] = useLazyQuery(GET_USER, {
    onCompleted: ({ getUser }) => {
      // subscribe to the topics for each of the new classes
      // easiest way could just be subscribing to all classes and not
      // worrying which ones we have already subscribed to

      // unclear how i would handle unsunscribing to the topics though

      // this is flawed because we need to manually refresh the page to trigger the
      // topic subscription code. this user will not be sent push notifications until the
      // subscription code is run

      // console.log('getUser', getUser.classes)

      getUser.classes.forEach(_class => {
        // subscribe to the class
        console.log('subscribing to the chat', _class.chatID)
        messaging()
          .subscribeToTopic(_class.chatID)
          .then(() => console.log('successfully subscribed to the topic'))
          .catch(e => console.log('was not able to subscribe to the topic', e))
      })

      setUser({...getUser})
    },
    fetchPolicy: 'no-cache'
  })

  React.useEffect(() => {
    getClasses();
  }, [])

  const goToChat = (sub: string, className: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]) => {
    navigation.navigate(
      'Chat',
      {
        chatID: sub,
        className,
        tutorInfo,
        userInfo
      }
    )
  }
  const goToCreateChat = () => navigation.navigate('CreateChat');
  const getClasses = () => {
    runQ({ variables: { userEmail: loggedUser.email}})
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRow>
          <GeneralSpacing u={0} d={0} r={10} l={10}>
            <Icon
              name='sync'
              type='antdesign'
              onPress={getClasses}
            />
          </GeneralSpacing>
          <PermissionedComponent
            allowedPermissions={[Permission.Admin]}
          >
            <Icon
              name='pluscircleo'
              type='antdesign'
              onPress={goToCreateChat}
            />
          </PermissionedComponent>
        </IconRow>
      ),
      headerRightContainerStyle: {
        padding: 10
      }
    })
  }, [])
  if (loading) {
    return (
      <>
        <ActivityIndicator animating={loading} />
        <View><Text>getting classes</Text></View>
      </>
    )
  }
  return (
    <SafeAreaView>
      <ChatsContain>
        {
          loggedUser.classes ? loggedUser.classes.map(_class => (
            <IndividualChat
              chatID={_class.chatID}
              userType={loggedUser.userType}
              classObject={_class}
              goToChat={goToChat}
              key={_class.chatID}
              getClasses={getClasses}
              displayNotificationBadge={!!notifications[_class.chatID]}
              clearNotificationCounter={clearNotificationCounter}
            />
          )) : <EmptyChatPicker />
        }
      </ChatsContain>
    </SafeAreaView>
  )
}

export default ChatPicker;
