import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

import Search from './LiftedSearch';
import classSearch from './LiftedClassSearch';
import InviteUser from './InviteUser';

interface IAdminPageProps {
  navigation: any;
  route: any;
}

type AdminStackProps = {
  UserHome: undefined;
  UserProfile: undefined;
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
const stack = createStackNavigator<AdminStackProps>();

const UserStack = () => (
  <stack.Navigator >
    <stack.Screen
      name="UserHome"
      component={Search}
      options={{
        header: () => null
      }}
    />
    <stack.Screen
      name="UserProfile"
      component={Classes}
      options={{
        header: () => null
      }}
    />
  </stack.Navigator>
)

// not sure if we need a stack for the classes
// const ClassesStack = () => (
//   <stack.Navigator>
//     <stack.Screen name="ClassesHome" component={} />
//     {/* <stack.Screen name= */}
//   </stack.Navigator>
// )

const AdminPage: React.FC<IAdminPageProps> = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Users" component={UserStack} />
      <Tab.Screen name="Classes" component={classSearch} />
      <Tab.Screen name="Invite User" component={InviteUser} />
    </Tab.Navigator>
  )
}

export default AdminPage;
