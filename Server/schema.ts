import { gql } from 'apollo-server';
// import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    getMessages(id: ID): message
  }

  type message {
    id: ID!
    text: String!
  }
`;

export default typeDefs;
