import React from 'react';
import {
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import {
  ChatUserInfo,
  Permission,
  Class
} from '../../types'
import { DELETE_CHAT } from '../../queries/DeleteChat';
import {
  ThemedText,
  PermissionedComponent,
  HorizontalDivider,
  VerticalDivider,
  IconRow,
  FONT_STYLES
 } from '../shared'
import { theme } from '../../theme';
import { NOTIFICATIONS_KEY } from '../../constant';

import {
  LoadingScreen,
  IconRowLeft,
  LeftText,
  RightText,
  SpacedItemRow,
  ChatContain,
  NotificationBadge
} from './common';

interface ChatDisplayProps {
  className: string;
  chatID: string
  mainText: string;
  secondaryText?: string;
  caption?: string;
  tutorInfo: ChatUserInfo;
  userInfo: ChatUserInfo[];
  displayNotificationBadge: boolean;
  goToChat (sub: string, sec: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]): void;
  getClasses (): void;
  clearNotificationCounter (chatID: string): void;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({
  mainText,
  secondaryText,
  caption,
  chatID,
  goToChat,
  className,
  getClasses,
  tutorInfo,
  userInfo,
  displayNotificationBadge,
  clearNotificationCounter
 }) => {

  const [delChat, { data, loading, error }] = useMutation(DELETE_CHAT, {
    onCompleted: () => {
      // console.log('done deleting chat')
      // getClasses();
    }
  });

  const options = { variables: { chatID } };

  const triggerMutation = () => delChat(options)

  const triggerDeleteAlert = () =>  (
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Delete',
          onPress: () => triggerMutation()
        },
        {
          text: 'Cancel',
          onPress: () => console.log('canceled'),
          style: 'cancel'
        },
      ]
    )
  )

  const onPress = (
    chatID: string,
    className: string,
    tutorInfo: ChatUserInfo,
    userInfo: ChatUserInfo[]
  ) => async () => {
    // clearNotificationCounter(chatID);
    const oldVal = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
    if (oldVal) {
      const oldDict = JSON.parse(oldVal);
      console.log('oldDict:', oldDict);
      if (oldDict[chatID]) {
        console.log('here')
        delete oldDict[chatID];
      }
      console.log('oldDict after del:', oldDict);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(oldDict))
    }
    goToChat(chatID, className, tutorInfo, userInfo)
  }

  return (
    <>
      { loading ? <LoadingScreen loading={loading} /> : (
        <ChatContain>
          <SpacedItemRow>
            <IconRow>
              {displayNotificationBadge && <NotificationBadge />}
              <TouchableOpacity
                onPress={onPress(chatID, className, tutorInfo, userInfo)}
                onLongPress={() => console.log('long press')}
                style={{
                  paddingRight: 30
                }}
              >
                <IconRowLeft>
                  <LeftText size={18} type={FONT_STYLES.MAIN}>
                    {mainText}
                  </LeftText>
                  {
                    !!secondaryText && (
                      <>
                        <VerticalDivider height={15} />
                        <RightText size={18} type={FONT_STYLES.MAIN}>
                          {secondaryText}
                        </RightText>
                      </>
                    )
                  }
                </IconRowLeft>
                {caption && (
                  <ThemedText size={14} type={FONT_STYLES.LIGHT}>
                    {caption}
                  </ThemedText>
                )}
              </TouchableOpacity>
            </IconRow>

            <PermissionedComponent
              allowedPermissions={[Permission.Admin]}
            >
              <Icon
                name='trash-o'
                type='font-awesome'
                onPress={triggerDeleteAlert}
              />
            </PermissionedComponent>
          </SpacedItemRow>
          <HorizontalDivider width={100} color={theme.colors.lightOrange} />
        </ChatContain>
      )}
    </>
  )
}

interface ndividualChatProps {
  chatID: string;
  userType: Permission;
  classObject: Class;
  displayNotificationBadge: boolean;
  userEmail: string;
  goToChat (sub: string, sec: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]): void;
  getClasses (): void;
  clearNotificationCounter (chatID: string): void;
}

const IndividualChat: React.FC<ndividualChatProps> = ({
  classObject,
  userType,
  chatID,
  goToChat,
  getClasses,
  displayNotificationBadge,
  clearNotificationCounter,
  userEmail
}) => {
  let caption;
  let mainText: string = '';
  let secondaryText: string = '';
  const userFirstName: string[] = classObject.userInfo.map(_user => _user.firstName);
  const otherUsers: string[] = classObject.userInfo.reduce<string[]>((acc, cur) => {
    if (cur.email !== userEmail) {
      return [...acc, cur.firstName];
    }

    return acc
  }, [])

  switch(userType) {
    case 'Student':
      mainText = classObject.className;
      caption = `Taught by ${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`
      break;
    case 'Guardian':
      mainText = classObject.className
      secondaryText = `${otherUsers.join(', ')}`
      caption = `Taught by ${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`
      break;
    case 'Tutor':
      mainText = `${userFirstName.join(', ')}`
      caption = classObject.className
      break
    case 'Admin':
      mainText = `${userFirstName.join(', ')}`
      secondaryText = classObject.className
      caption = `Taught by ${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`
      break;
    default:
      break;
  }

  return (
    <ChatDisplay
      chatID={chatID}
      caption={caption}
      mainText={mainText}
      secondaryText={secondaryText}
      goToChat={goToChat}
      className={classObject.className}
      getClasses={getClasses}
      tutorInfo={classObject.tutorInfo}
      userInfo={classObject.userInfo}
      displayNotificationBadge={displayNotificationBadge}
      clearNotificationCounter={clearNotificationCounter}
    />
  )
}

export default IndividualChat;