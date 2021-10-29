import * as React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useLazyQuery } from '@apollo/client';
import { useIsFocused } from '@react-navigation/native';
import styled from 'styled-components';

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
import {
  QueryGetUserArgs,
  GetUserPayload
 } from '../../../types/schema-types';

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

const ChatPickerScroll = styled(ScrollView)`
  margin-bottom: 25px;
`;

const ChatPicker: React.FC<ChatPickerProps> = ({ navigation }) => {
  const { loggedUser, setUser, notifications, updateNotifications, clearNotificationCounter } = React.useContext(GeneralContext);
  const [notifs, setNotifs] = React.useState<string[]>([]);
  const [unreadBadges, setUnreadBadges] = React.useState<string[]>([]);
  const isFocused = useIsFocused();

  const [getUser, { data, loading, error}] = useLazyQuery<{ getUser: GetUserPayload }, QueryGetUserArgs>(GET_USER, {
    onCompleted: ({ getUser }) => {
      setUser({...getUser.user})
      // update notificaation badges
      getUser.chatNotifications.forEach(_notifObject => {
        if (!_notifObject!.isAdmin) {
          setNotifs([...notifs, _notifObject!.chatID])
        }
      })

    },
    fetchPolicy: 'no-cache'
  })

  React.useEffect(() => {
    console.log('notifs changed in the chat picker', notifications)
    const badges = [...notifications.values()].reduce((acc, cur) => {
      if (cur.emails.includes(loggedUser.email)) {
        return [...acc, cur.chatID]
      }
      return acc
    }, [] as string[])

    setUnreadBadges(badges)
  }, [notifications, isFocused])

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
  const getClasses = () => getUser({ variables: { userEmail: loggedUser.email}})

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
    <View style={{ flex: 1}} >
      <ChatPickerScroll>
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
                displayNotificationBadge={unreadBadges.includes(_class.chatID)}
                clearNotificationCounter={clearNotificationCounter}
                userEmail={loggedUser.email}
              />
            ))
          }
        </ChatsContain>
      </ChatPickerScroll>
    </View>
  )
}

export default ChatPicker;
