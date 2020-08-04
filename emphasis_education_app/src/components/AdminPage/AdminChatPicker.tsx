import * as React from 'react';
import {
  View,
  Text
} from 'react-native'
import { Icon } from 'react-native-elements'
// import { createStackNavigator } from '@react-navigation/stack';

import Context from '../Context/Context';
import IndividualResult from './IndividualResult';

import { ThemedText, FONT_STYLES } from '../shared';
import { SearchResultsContainer } from '../Search/SearchResults';


interface IAdminChatPickerProps {
  navigation: any;
  route: any;
}

// let us get the chats from the context
const AdminChatPicker: React.FC<IAdminChatPickerProps> = ({ navigation }) => {
  const { loggedUser } = React.useContext(Context);

  return (
    <SearchResultsContainer>
      <Text>
        the admin chat pickerrrr
      </Text>
      {
        loggedUser.adminChat.map(_adminChat => (
          <IndividualResult>
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

    </SearchResultsContainer>
  )
}

export default AdminChatPicker;
