/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/components/screens/Login';
import Welcome from './src/components/screens/Welcome';
import Chat from './src/components/Chat';


// looks like i need to define all the routes here?
// TODO figure out the typing here
type RootStackProps = {
  Login: undefined;
  Welcome: undefined;
  Chat: undefined;
}

// let us create the navigator
const stack = createStackNavigator<RootStackProps>();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <stack.Navigator initialRouteName='Login'>
          <stack.Screen
            name="Login"
            component={Login}
            options={{
              title: '',
              headerStyle: {
                backgroundColor: 'white'
              }
            }}
          />
          <stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ title: '' }}
          />
          <stack.Screen
            name="Chat"
            component={Chat}
            options={{ title: '' }}
          />
        </stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
