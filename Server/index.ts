import { ApolloServer } from 'apollo-server';

import typeDefs from './schema';
import resolvers from './resolvers';
// import firebaseSvc from './firebaseSvc';
import dataSrc from './datasource';


const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    f: new dataSrc()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
