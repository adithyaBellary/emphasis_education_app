import * as React from 'react';
import {
  Alert,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import messaging from '@react-native-firebase/messaging';

import { GeneralContext } from '../Context/Context';
import {
  PermissionedComponent,
  IconRow,
  GeneralSpacing,
  CenteredDiv,
  ThemedText,
  VerticalDivider,
  HorizontalDivider,
  FONT_STYLES,
} from '../shared';
import { GET_USER } from '../../queries/GetUser';
import { DELETE_CHAT } from '../../queries/DeleteChat';
import {
  Permission,
  Class,
  ChatUserInfo,
  IUser
} from '../../types';
import { theme } from '../../theme';

import { EmptyChatPicker } from './common';

interface IChatPickerProps {
  navigation: any;
  route: any;
}

const IndChat = styled(TouchableOpacity)`
  border: black;
  width: 100%;
  height: 30px;
`;

export const ChatsContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={10} d={0} l={10}>
    {children}
  </GeneralSpacing>
);


const IconRowLeft = styled(IconRow)`
  justify-content: flex-start;
`;

const LeftText = styled(ThemedText)`
  padding-right: 5px;
`

const RightText = styled(ThemedText)`
  padding-left: 5px;
`

const Contain = styled(View)`
  padding: 10px;
  width: 80%;
  border-bottom-width: 1px;
  border-bottom-color: black;
`

const SpacedItemRow = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ChatContain: React.FC = ({ children }) => (
  <GeneralSpacing u={10} r={10} d={10} l={10}>
    {children}
  </GeneralSpacing>
);
interface IChatDisplay {
  className: string;
  chatID: string
  mainText: string;
  secondaryText?: string;
  caption?: string;
  tutorInfo: ChatUserInfo;
  userInfo: ChatUserInfo[];
  goToChat (sub: string, sec: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]): () => void;
  getClasses (): void;
}

const LoadingScreen: React.FC<{ loading: boolean }> = ({ loading }) => (
  <View>
    <Text>
      the chat is deleting
    </Text>
    <ActivityIndicator animating={loading} />
  </View>
)

const ChatDisplay: React.FC<IChatDisplay> = ({ mainText, secondaryText, caption, chatID, goToChat, className, getClasses, tutorInfo, userInfo }) => {

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

  return (
    <>
      { loading ? <LoadingScreen loading={loading} /> : (
        <ChatContain>
          <SpacedItemRow>
            <TouchableOpacity onPress={goToChat(chatID, className, tutorInfo, userInfo)} onLongPress={() => console.log('long press')}>
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
              {
                caption && (
                  <ThemedText size={14} type={FONT_STYLES.LIGHT}>
                    {caption}
                  </ThemedText>
                )
              }
            </TouchableOpacity>
            {/* <Icon
              name='trash'
              type='evilicon'
            /> */}

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
          <HorizontalDivider width={100} color={theme.colors.lightOrange}/>
        </ChatContain>
      )}
    </>
  )
}

interface IIndividualChatProps {
  chatID: string;
  userType: Permission;
  classObject: Class;
  goToChat (sub: string, sec: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]): () => void;
  getClasses (): void;
}

const IndividualChat: React.FC<IIndividualChatProps> = ({ classObject, userType, chatID, goToChat, getClasses }) => {

  let caption;
  let mainText: string = '';
  let secondaryText: string = '';
  // console.log('userType', userType)
  // console.log('classObject', classObject)
  const userFirstName: string[] = classObject.userInfo.map(_user => _user.firstName);

  switch(userType) {
    case 'Student':
      mainText = classObject.className;
      secondaryText = classObject.tutorInfo.firstName
      caption = 'test caption'
      break;
    case 'Parent':
      mainText = `${userFirstName.join(', ')}`
      secondaryText = classObject.className
      caption = `${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`

      break;
    case 'Tutor':
      mainText = `${userFirstName.join(', ')}`
      caption = classObject.className
      break
    case 'Admin':
      mainText = `${userFirstName.join(', ')}`
      secondaryText = classObject.className
      caption = `${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`

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
    />
  )
}

const ChatPicker: React.FC<IChatPickerProps> = ({ navigation }) => {
  const { loggedUser, setUser, notifications } = React.useContext(GeneralContext);
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
      console.log('getUser', getUser.classes)

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

  const goToChat = (sub: string, className: string, tutorInfo: ChatUserInfo, userInfo: ChatUserInfo[]) => () => {
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
            />
          )) : <EmptyChatPicker />
        }
      </ChatsContain>
    </SafeAreaView>
  )
}

export default ChatPicker;
