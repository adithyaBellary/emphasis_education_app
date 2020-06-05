import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import Search from './AdminPage/LiftedSearch';

// import { SEARCH_USERS } from '../queries/SearchUsers';
// import { SEARCH_CLASSES } from '../queries/SearchClasses';

interface IAdminPageProps {
  navigation: any;
  route: any;
}

const Classes = () => (
  <View>
    <Text>
      Classes
    </Text>
  </View>
)
// this should be where admins manage the classes and the students
const Tab = createBottomTabNavigator();

const AdminPage: React.FC<IAdminPageProps> = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={Search} />
      <Tab.Screen name="Classes" component={Classes} />
    </Tab.Navigator>
  )
}

export default AdminPage;
