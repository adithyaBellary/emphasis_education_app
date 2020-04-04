
const { ApolloServer } = require('apollo-server');
// import { ApolloServer } from 'apollo-server';
// import { typeDefs } from './schema';
// import { DataSource } from 'apollo-datasource';
// const TypeDefs = require('./schema.ts');
const { gql } = require('apollo-server');


// import DataSource from '../server/datasources/mock';
// yuck dont like this require business
const { dataSources } = require('../server/datasources/mock.ts');
// import dataSources from '../server/datasources/mock';

// what exactly needs to be in this context?
// this will serve as the global context for each resolver
const context = async ({ req }) => {
  console.log('in the context')
  const auth = req.headers && req.headers.authorization || '';
}

// console.log(TypeDefs);

const TYPEDEF = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

// const resolvers = {
//   Query: {
//     books: () => Books
//     // books: () => b
//   },
// };

const server = new ApolloServer({
  TYPEDEF,
  // context,
  dataSources: () => {
    return {
      data: new dataSources()
    }
  }
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`server is ready at ${url}`);
})
