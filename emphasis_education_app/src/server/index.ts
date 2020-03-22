import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

import { getData } from './datasources/mock';

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   dataSources: () => getData
// })
