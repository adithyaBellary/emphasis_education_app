import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Icon } from 'react-native-elements'

import { GeneralContext } from '../Context/Context';
import { IndividualResultButton } from './common';

import { ThemedText, FONT_STYLES, NotificationBadge } from '../shared';
import { SearchResultsContain }  from '../Search/common';

interface AdminChatPickerProps {
  navigation: any;
  route: any;
}

// let us get the chats from the context
const AdminChatPicker: React.FC<AdminChatPickerProps> = ({ navigation }) => {
  const { loggedUser, notifications } = React.useContext(GeneralContext);
  console.log('notifications', notifications);
  console.log('loggedUser in admin chat picker', loggedUser)

  if(!loggedUser.adminChat) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchResultsContain>
        {loggedUser.adminChat.map(_adminChat => (
          <IndividualResultButton
            key={_adminChat.chatID}
            onPress={() => navigation.navigate(
              'Chat',
              {
                chatID: _adminChat.chatID,
                className: 'Admin Chat'
              }
            )}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <NotificationBadge />
              <ThemedText size={14} type={FONT_STYLES.MAIN}>{_adminChat.user.firstName} {_adminChat.user.lastName}</ThemedText>
            </View>
            <Icon name='message' />
          </IndividualResultButton>
        ))}
      </SearchResultsContain>
    </View>
  )
}

export default AdminChatPicker;
