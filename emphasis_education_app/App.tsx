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
// import {  } from 'apollo-client';
// import { ,  } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split, ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { ThemeProvider } from 'styled-components';
import * as Sentry from "@sentry/react-native";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
 } from '@apollo/client';

import { SENTRY_DSN } from './config/sentry';

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
// const link = new ApolloLink().split(({ query }) => {
//   const definition = getMainDefinition(query);
//   return (
//     definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//   )
// },wsLink,
// httplink)

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
  // uri: 'http://localhost:4000/graphql'
});

Sentry.init({
  dsn: SENTRY_DSN,
  // seems like this release isnt getting mapped
  release: 'emphasis-education-app@' + process.env.npm_package_version
});

const App = () => {
  const [user, setUser] = React.useState<UserInfoType>({} as UserInfoType);
  const [notifications, incrementNotifications] = React.useState<NotificationsProps>({} as NotificationsProps);
  const updateUser = (newUser: UserInfoType) => {
    // set Sentry user here as well
    Sentry.setUser({
      email: newUser.email,
      username: `${newUser.firstName} ${newUser.lastName}`,
      'Permission': newUser.userType
    })
    setUser(newUser)
  }
  const incrementNotificationCounter = (chatID: string) => {
    let oldVal: number = 1;
    // console.log('old notifs', notifications[chatID])
    if (notifications[chatID]) {
      // console.log('we have an old one')
      oldVal = notifications[chatID] + 1
    }
    // console.log('notifications in the handleer', notifications)
    // console.log('new notifs', {...notifications, [chatID]: oldVal})
    incrementNotifications({...notifications, [chatID]: oldVal})
  }
  const clearNotificationCounter = (chatID: string) => {
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
