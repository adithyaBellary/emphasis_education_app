import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Search from './LiftedSearch';
import ClassSearch from './LiftedClassSearch';
import InviteUser from './InviteUser';
import AdminChatPicker from './AdminChatPicker';

import { theme } from '../../theme';

interface AdminPageProps {
  navigation: any;
  route: any;
}

const Tab = createBottomTabNavigator();

const AdminPage: React.FC<AdminPageProps> = () => {

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
      <Tab.Screen name="Admin Chats" component={AdminChatPicker} options={{ tabBarBadge: 3}}/>
    </Tab.Navigator>
  )
}

export default AdminPage;
