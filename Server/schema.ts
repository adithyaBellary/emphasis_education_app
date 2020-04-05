import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    getMessages(id: ID): message
    test_q: User!
  }

  type message {
    id: ID!
    text: String!
  }

  type User {
    name: String!
    email: String!
  }

  type Mutation {
    login(email: String!, password: String!): Boolean
    signup(email: String!, password: String!): User
  }
`;

export default typeDefs;
