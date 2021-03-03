import * as React from 'react';
import { View } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Search from './LiftedSearch';
import ClassSearch from './LiftedClassSearch';
import InviteUser from './InviteUser';
import AdminChatPicker from './AdminChatPicker';

import { theme } from '../../theme';
import { AuthContext, GeneralContext } from '../Context/Context';

interface AdminPageProps {
  navigation: any;
  route: any;
}

const Tab = createBottomTabNavigator();

const AdminPage: React.FC<AdminPageProps> = () => {
  const { setUser, notificationBadge, loggedUser, notifications, updateNotifications } = React.useContext(GeneralContext);
  const [adminChatBadge, setAdminChatBadge] = React.useState<boolean>(false);

  React.useEffect(() => {
    const admins: string[] = []
    Object
      .values(notifications)
      .forEach(notif => {
        if (notif.emails.includes(loggedUser.email)) {
          if (notif.isAdmin) {
            admins.push('hi')
          }
        }
      })
    setAdminChatBadge(admins.length > 0)

  }, [notifications]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          padding: 10,
          paddingVertical: 20,
          fontFamily: 'Nunito',
          fontSize: 12,
        },
        activeTintColor: theme.colors.purple,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Users" component={Search} />
      <Tab.Screen name="Classes" component={ClassSearch} />
      <Tab.Screen name="Invite User" component={InviteUser} />
      <Tab.Screen
        name="Admin Chats"
        component={AdminChatPicker}
        options={{
          tabBarIcon: () => {
            return (
              <>
                {adminChatBadge && (
                  <Badge
                    containerStyle={{
                      position: 'absolute',
                      top: 5,
                      right: 20,
                      zIndex: 100
                    }}
                    badgeStyle={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: 'green'
                    }}
                  />
                )}
              </>
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default AdminPage;
