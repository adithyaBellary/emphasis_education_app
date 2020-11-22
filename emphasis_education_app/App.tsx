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
import { getMainDefinition } from '@apollo/client/utilities'
import { ThemeProvider } from 'styled-components';
import * as Sentry from "@sentry/react-native";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
 } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
 import { SubscriptionClient } from 'subscriptions-transport-ws';

import { SENTRY_DSN } from './config/sentry';
import { VERSION } from './src/constant'
import { theme } from './src/theme';
import { Context, GeneralContext, NotificationsProps } from './src/components/Context/Context';
import StackNavigation from './src/StackNavigation';
import PushNotifWrapper from './PushNotifWrapper';
import { UserInfoType } from './types/schema-types';

Sentry.init({
  dsn: SENTRY_DSN,
  release: 'emphasis-education-app@' + VERSION
});

const DEBUG = false;

const cache = new InMemoryCache();
const httplink = new HttpLink({
  uri: DEBUG ? 'http://localhost:4000/' : 'https://emphasis-education-server.herokuapp.com/'
});

const errLink = onError(({ operation, graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path}) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)

      Sentry.captureMessage(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }
  if (networkError) {
    console.log(`[Network error!]: ${networkError}`)
    Sentry.captureMessage(`[Network error!]: ${networkError}`)
  }

  if (operation) {
    console.log(`operationName: ${operation.operationName}`)
    Sentry.captureMessage(`[Operation name]: ${operation.operationName}`)
  }
})

const wsUrl = DEBUG ? 'ws://localhost:4000/graphql' : 'ws://emphasis-education-server.herokuapp.com/graphql';
const wsClient = new SubscriptionClient(
  wsUrl,
  {
    reconnect: true,
    lazy: true,
    // connectionCallback: (error, result) => {
    //   console.log('connectionCallback error', error)
    //   console.log('connectionCallback result', result)
    //   Sentry.captureMessage(`Subscription callback ${!!error} ${!!result}`)
    // },
    connectionParams: {
      authToken: '123'
    }
  }
)

const wsLink = new WebSocketLink(wsClient)

// const wsLink = new WebSocketLink({
//   uri: 'ws://emphasis-education-server.herokuapp.com/graphql',
//   // uri: 'ws://localhost:4000/graphql',
//   options: {
//     reconnect: true,
//     // timeout: 10000,
//     lazy: true,
//     connectionCallback: (error, result) => {
//       console.log('connectionCallback error', error)
//       console.log('connectionCallback result', result)
//       Sentry.captureMessage(`Subscription callback ${!!error} ${!!result}`)
//     },
//     connectionParams: {
//       authToken: '123'
//     }
//   }
// });

console.log('the ws link is created', wsLink)
Sentry.captureMessage(`The ws link is created i think? ${!!wsLink}`)
// Sentry.captureMessage(`The ws link is created: ${wsLink}`)

const link = split(({ query }) => {
  const definition = getMainDefinition(query);
  const isSub = (definition.kind === 'OperationDefinition') && (definition.operation === 'subscription')
  console.log('isSub?', isSub)
  Sentry.captureMessage(`isSub? ${isSub}`)
  return isSub
},wsLink,
  httplink
)

const theLink = ApolloLink.from([
  errLink,
  link
])

console.log('link', link)
Sentry.captureMessage(`the link is created i think? ${!!link}`)
// console.log('link', !!link)

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: theLink
});

console.log('the client', client)
Sentry.captureMessage(`the client is created i think? ${!!client}`)
// console.log('the client', !!client)

const App = () => {
  const [user, setUser] = React.useState<UserInfoType>({} as UserInfoType);
  const [notifications, incrementNotifications] = React.useState<NotificationsProps>({} as NotificationsProps);
  const [notificationBadge, setBadge] = React.useState<boolean>(false);
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
    if (notifications[chatID]) {
      oldVal = notifications[chatID] + 1
    }
    incrementNotifications({...notifications, [chatID]: oldVal})
  }

  const clearNotificationCounter = (chatID: string) => {
    incrementNotifications({ ...notifications, [chatID]: 0})
    setBadge(false)
  }

  const setNotificationBadge = (status: boolean) => {
    setBadge(status)
  }

  const value: Context = {
    loggedUser: user,
    notifications,
    incrementNotificationCounter,
    clearNotificationCounter,
    setUser: updateUser,
    notificationBadge,
    setNotificationBadge
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
