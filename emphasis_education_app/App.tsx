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
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import { getMainDefinition } from 'apollo-utilities';
import { ThemeProvider } from 'styled-components';

import { theme } from './src/theme';
import context, {EmptyUser, AuthContext} from './src/components/Context/Context';
import { IUser, ILoginPayload } from './src/types';

import StackNavigation from './src/StackNavigation';

const cache = new InMemoryCache();
const httplink = new HttpLink({
  // uri: 'https://emphasis-education-server.herokuapp.com/graphql'
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new WebSocketLink({
  // uri: `ws://emphasis-education-server.herokuapp.com/graphql`,
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

const App = () => {

  const [user, setUser] = React.useState<IUser>({} as IUser);
  const updateUser = (newUser: IUser) => setUser(newUser)
  const value = {
    loggedUser: user,
    setUser: updateUser
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <context.Provider value={value}>
          <StackNavigation />
        </context.Provider>
      </ThemeProvider>
    </ApolloProvider>
  )
};

export default App;
