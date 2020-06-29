import * as React from 'react';
import {
  Alert,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

import styled from 'styled-components';
import Context from './Context/Context';
import { PermissionedComponent } from './shared';
import Accordion from './Accordion';

import { Permission } from '../types';

interface IChatPickerProps {
  navigation: any;
  route: any;
}

const IndChat = styled(TouchableOpacity)`
  border: black;
  width: 100%;
  height: 30px;
`;

const ChatsContain = styled(View)`
  padding: 0 10px;
`

const EmptyChat: React.FC = () => (
  <View>
    <Text>
      You are currently not added to any chats. Please contact the Admins to be added to a chat
    </Text>
  </View>
)

const ChatPicker: React.FC<IChatPickerProps> = ({ navigation }) => {
  const { loggedUser } = React.useContext(Context);
  console.log('logged user in chat picker', loggedUser);

  const goToChat = (sub: string) => () => {
    navigation.navigate(
      'Chat',
      {
        chatID: sub
      }
    )
  }
  const goToCreateChat = () => navigation.navigate('CreateChat');

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        // <PermissionedComponent
        //   // allowedPermission={Permission.Admin}
        //   // this will need to be changed to the Admin later
        //   allowedPermission={Permission.Student}
        // >
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={goToCreateChat}
          />
        // </PermissionedComponent>
      ),
      headerRightContainerStyle: {
        padding: 10
      }
    })
  }, [])
  // add dropdown functionality
  return (
    <>
      <SafeAreaView>
        <ChatsContain>
          {loggedUser.classes ? loggedUser.classes.map((c) => (
            <IndChat
              onPress={goToChat(c.chatID!)}
            >
              <Text>{c.className}</Text>
            </IndChat>
          )) : (
            <EmptyChat />
          )}
          {/* {loggedUser.classes ? loggedUser.classes.map(c => (
            <Accordion
              title={c.displayName}
              data={loggedUser.classes!}
            />
          )) : <EmptyChat />} */}
        </ChatsContain>
      </SafeAreaView>
    </>
  )
}

export default ChatPicker;
