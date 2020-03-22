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

type RootStackProps ={
  Login: undefined;
}

// let us create the navigator
// const Navigation: any = createStackNavigator<RootStackProps>();



const App = () => {
  return (
    <Login />
  );
};

export default App;
