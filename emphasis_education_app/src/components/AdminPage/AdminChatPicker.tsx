import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Icon } from 'react-native-elements'

import { GeneralContext } from '../Context/Context';
import IndividualResult from './common';

import { ThemedText, FONT_STYLES } from '../shared';
import { SearchResultsContain }  from '../Search/common';


interface AdminChatPickerProps {
  navigation: any;
  route: any;
}

// let us get the chats from the context
const AdminChatPicker: React.FC<AdminChatPickerProps> = ({ navigation }) => {
  const { loggedUser } = React.useContext(GeneralContext);

  if(!loggedUser.adminChat) {
    return null
  }

  return (
    <View>
      <SearchResultsContain>
        {
          loggedUser.adminChat.map(_adminChat => (
            <IndividualResult
              key={_adminChat.chatID}
            >
              <ThemedText size={14} type={FONT_STYLES.MAIN}>{_adminChat.user.firstName} {_adminChat.user.lastName}</ThemedText>
              <Icon
                name='message'
                onPress={() => navigation.navigate(
                  'Chat',
                  {
                    chatID: _adminChat.chatID,
                    className: 'Admin Chat'
                  }
                )}
              />
            </IndividualResult>
          ))
        }
      </SearchResultsContain>
    </View>
  )
}

export default AdminChatPicker;
