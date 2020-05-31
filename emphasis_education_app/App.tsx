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
import { ThemeProvider } from 'styled-components';

import Login from './src/components/Login';
import Chat from './src/components/Chat';
import HomePage from './src/components/HomePage';
import CreateUser from './src/components/CreateUser';
import ChatPicker from './src/components/ChatPicker';
import Profile from './src/components/LiftedProfile';
import CreateUserContain from './src/components/CreateUserContainer';
import ConfirmationScreen from './src/components/ConfirmationScreen';
import Search from './src/components/Search/LiftedSearch';
import { theme } from './src/theme';

import context, {EmptyUser} from './src/components/Context/Context';
import { IUser } from './src/types';

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


// TODO add typing that each route needs
type RootStackProps = {
  Login: undefined;
  Home: undefined;
  Chat: undefined;
  ChatPicker: undefined;
  CreateUser: undefined;
  CreateUserContain: undefined;
  MyProfile: undefined;
  ConfirmationScreen: undefined;
  Search: undefined;
}

const stack = createStackNavigator<RootStackProps>();

const App = () => {
  // wrap this all in the context
  const [user, setUser] = React.useState<IUser>(EmptyUser);
  const updateUser = (newUser: IUser) => setUser(newUser)
  const value = {
     loggedUser: user,
     setUser: updateUser
    }
  return (
    <context.Provider value={value}>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <stack.Navigator initialRouteName='Login'>
              <stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#5a1846'
                  }
                }}
              />
              <stack.Screen
                name="Home"
                component={HomePage}
                options={{ title: '' }}
              />
              <stack.Screen
                name="Search"
                component={Search}
                options={{ title: '' }}
              />
              {/* can maybe get the name of the chat and then set the title to it */}
              <stack.Screen
                name="Chat"
                component={Chat}
                options={{ title: 'Test Subject' }}
              />
              <stack.Screen
                name="CreateUser"
                component={CreateUser}
                options={{ title: '' }}
              />
              <stack.Screen
                name="ChatPicker"
                component={ChatPicker}
                options={{ title: 'My Chats' }}
              />
              <stack.Screen
                name="MyProfile"
                component={Profile}
                options={{ title: 'My Profile' }}
              />
              <stack.Screen
                name="CreateUserContain"
                component={CreateUserContain}
                options={{ title: '' }}
              />
              <stack.Screen
                name="ConfirmationScreen"
                component={ConfirmationScreen}
                options={{ title: '' }}
              />
            </stack.Navigator>
          </NavigationContainer>
        </ApolloProvider>
      </ThemeProvider>
    </context.Provider>
  )
};

export default App;
