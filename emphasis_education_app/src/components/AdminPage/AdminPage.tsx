import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Search from './LiftedSearch';
import classSearch from './LiftedClassSearch';
import InviteUser from './InviteUser';
import AdminChatPicker from './AdminChatPicker';

interface AdminPageProps {
  navigation: any;
  route: any;
}

// this should be where admins manage the classes and the students
const Tab = createBottomTabNavigator();

const AdminPage: React.FC<AdminPageProps> = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={Search} />
      <Tab.Screen name="Classes" component={classSearch} />
      <Tab.Screen name="Invite User" component={InviteUser} />
      <Tab.Screen name="Admin Chats" component={AdminChatPicker} />
    </Tab.Navigator>
  )
}

export default AdminPage;
