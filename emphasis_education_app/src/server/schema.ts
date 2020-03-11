// const { gql } = require('react-apollo');
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {

  }

  type student {
    id: ID!
    name: String
    phoneNumber: String
    classesTaken: [class]
  }
  type tutor {
    id: ID!
    classesTaught: [class]
  }

  type admin {
    id: ID!
    name: String
    phoneNumber: String
    classesTaught: String
  }

  type class {
    id: ID!
    name: String
    desc: String
  }

`;

module.exports = typeDefs;