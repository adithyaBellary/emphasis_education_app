/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { getMainDefinition } from 'apollo-utilities';
import { ThemeProvider } from 'styled-components';

import { theme } from './src/theme';
import { GeneralContext, Context, NotificationsProps } from './src/components/Context/Context';
import StackNavigation from './src/StackNavigation';
import PushNotifWrapper from './PushNotifWrapper';
import { UserInfoType } from './types/schema-types';

const cache = new InMemoryCache();
const httplink = new HttpLink({
  uri: 'https://emphasis-education-server.herokuapp.com/graphql'
  // uri: 'http://localhost:4000/graphql'
});

const wsLink = new WebSocketLink({
  uri: `ws://emphasis-education-server.herokuapp.com/graphql`,
  // uri: `ws://localhost:4000/graphql`,
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

const App = () => {

  const [user, setUser] = React.useState<UserInfoType>({} as UserInfoType);
  const [notifications, incrementNotifications] = React.useState<NotificationsProps>({} as NotificationsProps);
  const updateUser = (newUser: UserInfoType) => setUser(newUser)
  const incrementNotificationCounter = (chatID: string) => {
    let oldVal: number = 1;
    console.log('old notifs', notifications[chatID])
    if (notifications[chatID]) {
      console.log('we have an old one')
      oldVal = notifications[chatID] + 1
    }
    console.log('notifications in the handleer', notifications)
    console.log('new notifs', {...notifications, [chatID]: oldVal})
    incrementNotifications({...notifications, [chatID]: oldVal})
  }
  const clearNotificationCounter = (chatID: string) => {
    console.log('clearing', chatID)
    incrementNotifications({ ...notifications, [chatID]: 0})
  }

  const value: Context = {
    loggedUser: user,
    notifications,
    incrementNotificationCounter,
    clearNotificationCounter,
    setUser: updateUser
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GeneralContext.Provider value={value}>
          <PushNotifWrapper>
            <StackNavigation />
          </PushNotifWrapper>
        </GeneralContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  )
};

export default App;
