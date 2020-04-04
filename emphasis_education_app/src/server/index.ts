// const { ApolloServer } = require('apollo-server');
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { DataSource } from 'apollo-datasource';
// const typeDefs = require('./schema');

// import DataSource from '../server/datasources/mock';
// yuck dont like this require business
const { dataSources } = require('../server/datasources/mock');

// const dataSources = () => ({
//   MockDataSource: new dataSources
// })

// what exactly needs to be in this context?
// this will serve as the global context for each resolver
const context = async ({ req }) => {

}

const server = new ApolloServer({
  typeDefs,
  context,
  dataSources: () => ({
    MockDataSource: new dataSources()
  })
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`server is ready at ${url}`);
})
