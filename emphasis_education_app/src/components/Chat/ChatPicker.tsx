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
import Context from '../Context/Context';
import {
  PermissionedComponent,
  IconRow,
  GeneralSpacing,
  CenteredDiv,
  ThemedText,
  VerticalDivider,
  HorizontalDivider,
} from '../shared';
import Accordion from './Accordion';

import {
  Permission,
  Class
} from '../../types';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_USER } from '../../queries/GetUser';

interface IChatPickerProps {
  navigation: any;
  route: any;
}

const IndChat = styled(TouchableOpacity)`
  border: black;
  width: 100%;
  height: 30px;
`;

const ChatsContain: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={10} d={0} l={10}>
    {children}
  </GeneralSpacing>
);

const EmptyChat: React.FC = () => (
  <CenteredDiv>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type='light'>
        You are currently not added to any Chats.
        Please reach out to either Shweta or Sakthi to be added to one.
      </ThemedText>
    </GeneralSpacing>
  </CenteredDiv>
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

const ChatContain: React.FC = ({ children }) => (
  <GeneralSpacing u={10} r={10} d={10} l={10}>
    {children}
  </GeneralSpacing>
);
interface IChatDisplay {
  chatID: string
  mainText: string;
  secondaryText?: string;
  caption?: string;
  goToChat (sub: string): () => void;
}

const ChatDisplay: React.FC<IChatDisplay> = ({ mainText, secondaryText, caption, chatID, goToChat }) => (
  <ChatContain>
    <TouchableOpacity onPress={goToChat(chatID)} onLongPress={() => console.log('long press')}>
      <IconRowLeft>
        <LeftText size={18} type='main'>
          {mainText}
        </LeftText>
        {
          secondaryText && (
            <>
              <VerticalDivider height={15}/>
              <RightText size={18} type='main'>
                {secondaryText}
              </RightText>
            </>
          )
        }
      </IconRowLeft>

      {
        caption && (
          <ThemedText size={14} type='light'>
            {caption}
          </ThemedText>
        )
      }


    </TouchableOpacity>

    <HorizontalDivider width={80} />
  </ChatContain>
)

interface IIndividualChatProps {
  chatID: string;
  userType: Permission;
  classObject: Class;
  goToChat (sub: string): () => void;
}

const IndividualChat: React.FC<IIndividualChatProps> = ({ classObject, userType, chatID, goToChat }) => {

  let caption;
  let mainText: string = '';
  let secondaryText: string = '';
  console.log('userType', userType)
  console.log('classObject', classObject)
  const userFirstName: string[] = classObject.userInfo.map(_user => _user.firstName);

  switch(userType) {
    case 'Student':
      mainText = classObject.className;
      // mainText = `${['hi', 'hello'].join(', ')}`
      secondaryText = classObject.tutorInfo.firstName
      // no caption
      caption = 'test caption'
      break;
    case 'Parent' || 'Admin':
      // mainText = need to find the users who are students among the userEmails field
      mainText = `${userFirstName.join(', ')}`
      secondaryText = classObject.className
      caption = `${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`

      break;
    case 'Tutor':
      mainText = `${userFirstName.join(', ')}`
      caption = classObject.className
      // no need for secondaryTExt?
      break
    // case 'Admin':


    //   break;
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
    />
  )
}

const ChatPicker: React.FC<IChatPickerProps> = ({ navigation }) => {
  const { loggedUser, setUser } = React.useContext(Context);
  console.log('logged user in chat picker', loggedUser);
  const [runQ, { data, loading, error}] = useLazyQuery(GET_USER, {
    onCompleted: ({ getUser }) => {
      setUser({...getUser})
    },
    fetchPolicy: 'no-cache'
  })
  const goToChat = (sub: string) => () => {
    navigation.navigate(
      'Chat',
      {
        chatID: sub
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
        // <PermissionedComponent
        //   // allowedPermission={Permission.Admin}
        //   // this will need to be changed to the Admin later
        //   allowedPermission={Permission.Student}
        // >
        <IconRow>
          <GeneralSpacing u={0} d={0} r={10} l={10}>
            <Icon
              name='sync'
              type='antdesign'
              onPress={getClasses}
            />
          </GeneralSpacing>
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={goToCreateChat}
            />
        </IconRow>
        // </PermissionedComponent>
      ),
      headerRightContainerStyle: {
        padding: 10
      },
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('ChatInfo')}>
          <Text>
            is this working?
          </Text>
        </TouchableOpacity>
      )
    })
  }, [])
  // add dropdown functionality
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
            />
          )) : <EmptyChat />
        }


        {/* {loggedUser.classes ? loggedUser.classes.map(c => (
          <Accordion
            title={c.displayName}
            data={loggedUser.classes!}
          />
        )) : <EmptyChat />} */}
      </ChatsContain>
    </SafeAreaView>
  )
}

export default ChatPicker;
