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

const ChatPicker: React.FC<IChatPickerProps> = ({ navigation }) => {
  const { loggedUser } = React.useContext(Context);
  const userType = loggedUser.userType;

  const goToChat = (sub: string) => async () => {
    navigation.navigate(
      'Chat',
      {
        chatID: sub
      }
    )
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PermissionedComponent
          // allowedPermission={Permission.Admin}
          // this will need to be changed to the Admin later
          allowedPermission={Permission.Student}
        >
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={() => Alert.alert('go to create new chat')}
            />
        </PermissionedComponent>
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
          {loggedUser.chatIDs.map((sub: string) => {
            return (
              <IndChat
                onPress={goToChat(sub)}
                key={sub}
              >
                <Text>
                  {sub}
                </Text>
              </IndChat>
              )
          })}
        </ChatsContain>
      </SafeAreaView>
    </>
  )
}

export default ChatPicker;
