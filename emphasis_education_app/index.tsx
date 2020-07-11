/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
// import {name as appName} from './app.json';

// import { ApolloClient } from 'apollo-client';
// import { ApolloProvider } from '@apollo/react-hooks';
// import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';


// const cache = new InMemoryCache();
// const link = new HttpLink({
//   uri: 'http://localhost:4000'
// });

// const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
//   cache,
//   link
// });

// const MyApp = () => (
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>
// )


AppRegistry.registerComponent('emphasis_education_app', () => App);
