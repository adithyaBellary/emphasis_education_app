import * as React from 'react';
import {
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useLazyQuery } from '@apollo/client';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import { GeneralContext } from '../Context/Context';
import {
  CenteredDiv,
  FONT_STYLES,
  GeneralSpacing,
  IconRow,
  LoadingComponent,
  PermissionedComponent,
  ThemedText,
} from '../shared';
import { GET_USER } from '../../queries/GetUser';
import { Permission, ChatUserInfo, } from '../../types';
import { UserInfoTypeInput } from '../../../types/schema-types';
import { NOTIFICATIONS_KEY, VERSION } from '../../../src/constant';

import { EmptyChatPicker } from './common';
import IndividualChat from './IndividualChat';

interface ChatPickerProps {
  navigation: any;
  route: any;
}

export const ChatsContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={10} d={0} l={10}>
    {children}
  </GeneralSpacing>
);

const ChatPicker: React.FC<ChatPickerProps> = ({ navigation }) => {
  const { loggedUser, setUser, notifications, clearNotificationCounter } = React.useContext(GeneralContext);
  const [notifs, setNotifs] = React.useState({} as {[key: string]: boolean});
  // console.log('notifications badge', notifications);
  // console.log('logged user in chat picker', loggedUser);
  const [getUser, { data, loading, error}] = useLazyQuery(GET_USER, {
    onCompleted: ({ getUser }) => {
      // subscribe to the topics for each of the new classes
      // easiest way could just be subscribing to all classes and not
      // worrying which ones we have already subscribed to

      // unclear how i would handle unsunscribing to the topics though

      // this is flawed because we need to manually refresh the page to trigger the
      // topic subscription code. this user will not be sent push notifications until the
      // subscription code is run

      // console.log('getUser', getUser.classes)
      // if (getUser.classes) {
      //   getUser.classes.forEach(_class => {
      //     // subscribe to the class
      //     // console.log('subscribing to the chat', _class.chatID)
      //     messaging()
      //       .subscribeToTopic(_class.chatID)
      //       // .then(() => console.log('successfully subscribed to the topic'))
      //       .catch(e => console.log('was not able to subscribe to the topic', e))
      //   })
      // }

      setUser({...getUser})
    },
    fetchPolicy: 'no-cache'
  })

  React.useEffect(() => {
    getClasses();
  }, [])

  React.useState(() => {
    const asyncFcn = async () => {
      const oldVal = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
      if (oldVal) {
        const oldDict = JSON.parse(oldVal);
        setNotifs(oldDict);
      }
    }

    asyncFcn()
  })

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
  const getClasses = () => getUser({ variables: { userEmail: loggedUser.email}})

  // if (notifs) {
  //   console.log('in chat picker', notifs);
  // }
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
      <CenteredDiv>
        <LoadingComponent loading={loading} />
        <View>
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            Please wait, getting classes...
          </ThemedText>
        </View>
      </CenteredDiv>
    )
  }
  if (!loggedUser.classes) {
    return  <EmptyChatPicker />
  }
  return (
    <SafeAreaView>
      <ChatsContain>
        {
          loggedUser.classes && loggedUser.classes.map(_class => (
            <IndividualChat
              chatID={_class.chatID}
              userType={loggedUser.userType}
              classObject={_class}
              goToChat={goToChat}
              key={_class.chatID}
              getClasses={getClasses}
              // displayNotificationBadge={!!notifications[_class.chatID]}
              displayNotificationBadge={!!notifs[_class.chatID]}
              clearNotificationCounter={clearNotificationCounter}
              userEmail={loggedUser.email}
            />
          ))
        }
      </ChatsContain>
    </SafeAreaView>
  )
}

export default ChatPicker;
