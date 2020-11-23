import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Search from './LiftedSearch';
import ClassSearch from './LiftedClassSearch';
import InviteUser from './InviteUser';
import AdminChatPicker from './AdminChatPicker';

interface AdminPageProps {
  navigation: any;
  route: any;
}

const Tab = createBottomTabNavigator();

const AdminPage: React.FC<AdminPageProps> = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={Search} />
      <Tab.Screen name="Classes" component={ClassSearch} />
      <Tab.Screen name="Invite User" component={InviteUser} />
      <Tab.Screen name="Admin Chats" component={AdminChatPicker} />
    </Tab.Navigator>
  )
}

export default AdminPage;
