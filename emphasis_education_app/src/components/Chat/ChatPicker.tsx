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
  ThemedText
} from '../shared';
import Accordion from './Accordion';

import { Permission } from '../../types';
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

const ChatsContain = styled(View)`
  padding: 0 10px;
`
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
      }
    })
  }, [])
  // add dropdown functionality
  if (loading) {
    return (
      <>
        <ActivityIndicator />
        <View><Text>getting classes</Text></View>
      </>
    )
  }
  return (
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
  )
}

export default ChatPicker;
