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
const DEV = false;

const cache = new InMemoryCache();

const httplink = new HttpLink({
  uri: DEBUG ? 'http://localhost:4000/' : DEV ? 'https://emphasis-server-test.herokuapp.com/' : 'https://emphasis-education-server.herokuapp.com/'
});

const errLink = onError(({ operation, graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path}) => {

      Sentry.captureMessage(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })
  }
  if (networkError) {
    Sentry.captureMessage(`[Network error!]: ${networkError}`)
  }

  if (operation) {
    Sentry.captureMessage(`[Operation name]: ${operation.operationName}`)
  }
})

const wsUrl = DEBUG ? 'ws://localhost:4000/graphql' : DEV ? 'ws://emphasis-server-test.herokuapp.com/graphql' : 'ws://emphasis-education-server.herokuapp.com/graphql';
const wsClient = new SubscriptionClient(
  wsUrl,
  {
    reconnect: true,
    lazy: true,
    connectionParams: {
      authToken: '123'
    }
  }
)

const wsLink = new WebSocketLink(wsClient)

const link = split(({ query }) => {
  const definition = getMainDefinition(query);
  const isSub = (definition.kind === 'OperationDefinition') && (definition.operation === 'subscription')
  return isSub
},wsLink,
  httplink
)

const theLink = ApolloLink.from([
  errLink,
  link
])

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: theLink
});

const App = () => {
  const [user, setUser] = React.useState<UserInfoType>({} as UserInfoType);
  // const [notifications, setNotifications] = React.useState<NotificationsProps>({} as NotificationsProps);
  const [notifications, setNotifications] = React.useState<Map<string, {chatID: string, isAdmin: boolean, emails: string[]}>>(new Map<string, {chatID: string, isAdmin: boolean, emails: string[]}>());
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
  const updateNotifications = (chatID: string, isAdmin: boolean, emails: string[]) => {

    console.log('new chat ID', chatID)
    // console.log('setting v1', {...notifications, [chatID]: {chatID, isAdmin, emails}})
    console.log('notifications before', notifications)
    // const no = new Map<string, {chatID: string, isAdmin: boolean, emails: string[]}>()
    // no[chatID] = {chatID, isAdmin, emails}
    notifications.set(chatID, {chatID, isAdmin, emails})
    // notifications[chatID] = {chatID, isAdmin, emails}
    console.log('notifications after', notifications)
    // setNotifications(notifications)
    setNotifications(notifications)
    // setNotifications({...notifications, [chatID]: {chatID, isAdmin, emails}})
  }

  const clearAllNotifications = () => {
    setNotifications(new Map<string, {chatID: string, isAdmin: boolean, emails: string[]}>())
  }

  const clearNotificationCounter = (chatID: string) => {
    console.log('old notifs in delete', notifications)
    // delete notifications[chatID]
    notifications.delete(chatID)
    // setNotifications({ ...notifications})
    console.log('new notifications in delete', notifications)
    setNotifications(notifications)
    setBadge(false)
  }

  const setNotificationBadge = (status: boolean) => {
    setBadge(status)
  }

  const value: Context = {
    loggedUser: user,
    notifications,
    updateNotifications,
    clearNotificationCounter,
    setUser: updateUser,
    notificationBadge,
    setNotificationBadge,
    clearAllNotifications
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
