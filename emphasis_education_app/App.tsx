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
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { getMainDefinition } from 'apollo-utilities';


import Login from './src/components/Login';
import Chat from './src/components/Chat';
import HomePage from './src/components/HomePage';
import CreateUser from './src/components/CreateUser';
import ChatPicker from './src/components/ChatPicker';

const cache = new InMemoryCache();
const httplink = new HttpLink({
  uri: 'http://localhost:4000'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true
  }
});

const link = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  )
},wsLink,
httplink)

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});


// looks like i need to define all the routes here?
// TODO add typing that each route needs
type RootStackProps = {
  Login: undefined;
  Home: undefined;
  Chat: {
    name: string,
    email: string,
    _id: string
  };
  ChatPicker: undefined;
  CreateUser: undefined
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
          name="Home"
          component={HomePage}
          options={{ title: '' }}
        />
        <stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: '' }}
        />
        <stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={{ title: '' }}
        />
        <stack.Screen
          name="ChatPicker"
          component={ChatPicker}
          options={{ title: '' }}
        />
      </stack.Navigator>
    </NavigationContainer>
  </ApolloProvider>
);

export default App;
