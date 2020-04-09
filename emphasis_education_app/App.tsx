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
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

import Login from './src/components/Login';
import Welcome from './src/components/screens/Welcome';
import Chat from './src/components/Chat';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000'
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});


// looks like i need to define all the routes here?
// TODO add typing that each route needs
type RootStackProps = {
  Login: undefined;
  Welcome: undefined;
  Chat: {
    name: string,
    email: string
  };
  ChatPicker: undefined;
}

// let us create the navigator
const stack = createStackNavigator<RootStackProps>();

// TODO might need to wrap this all in an
// <ApolloProvider /> tag so that everything can access graphQL
const App = () => (
  <ApolloProvider client={client}>
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
  </ApolloProvider>
);

export default App;
