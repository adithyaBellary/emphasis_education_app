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
import { useLazyQuery } from '@apollo/react-hooks';

import Context from '../Context/Context';
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
import {
  Permission,
  Class
} from '../../types';
import { theme } from '../../theme';

import Accordion from './Accordion';
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

const ChatsContain: React.FC = ({ children }) => (
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
  goToChat (sub: string, sec: string): () => void;
}

const ChatDisplay: React.FC<IChatDisplay> = ({ mainText, secondaryText, caption, chatID, goToChat, className }) => (
  <ChatContain>
    <TouchableOpacity onPress={goToChat(chatID, className)} onLongPress={() => console.log('long press')}>
      <IconRowLeft>
        <LeftText size={18} type={FONT_STYLES.MAIN}>
          {mainText}
        </LeftText>
        {
          secondaryText && (
            <>
              <VerticalDivider height={15}/>
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
    <HorizontalDivider width={100} color={theme.colors.lightOrange}/>
  </ChatContain>
)

interface IIndividualChatProps {
  chatID: string;
  userType: Permission;
  classObject: Class;
  goToChat (sub: string, sec: string): () => void;
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
      secondaryText = classObject.tutorInfo.firstName
      caption = 'test caption'
      break;
    case 'Parent' || 'Admin':
      mainText = `${userFirstName.join(', ')}`
      secondaryText = classObject.className
      caption = `${classObject.tutorInfo.firstName} ${classObject.tutorInfo.lastName}`

      break;
    case 'Tutor':
      mainText = `${userFirstName.join(', ')}`
      caption = classObject.className
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
      className={classObject.className}
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
  const goToChat = (sub: string, className: string) => () => {
    navigation.navigate(
      'Chat',
      {
        chatID: sub,
        className
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
      }
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
          )) : <EmptyChatPicker />
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
