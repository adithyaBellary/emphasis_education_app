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
  const [adminChatWithNotif, setAdminChatWithNotif] = React.useState<string[]>([]);
  console.log('notifications', notifications);
  console.log('loggedUser in admin chat picker', loggedUser)

  React.useEffect(() => {
    const adminChatIDs = Object.values(notifications).map(_notif => {
      if (_notif.isAdmin) {
        return _notif.chatID
      } else return ''
    }).filter(_adminChatID => !!_adminChatID)

    setAdminChatWithNotif(adminChatIDs)
  }, [notifications])



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
              {adminChatWithNotif.includes(_adminChat.chatID) && (
                <NotificationBadge />
              )}
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
