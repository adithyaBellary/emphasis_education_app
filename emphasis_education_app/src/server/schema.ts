// const { gql } = require('react-apollo');
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {

  }

  type student {
    id: ID!
    name: String!
    year: Int!
    parentName: String
    phoneNumber: String!
    classesTaken: [class]!
  }
  type tutor {
    id: ID!
    rate: Float!
    classesTaught: [class]!
    studentsTaught: [student]!

  }

  type admin {
    id: ID!
    name: String!
    phoneNumber: String!
    classesTaught: [class]!
  }

  type subject {
    id: ID!
    name: String!
    desc: String!
  }

  type message {
    id: ID!
    content: String!
    to: String!
    from: String!
    # what date/time types do we have
    timestamp: date
    # this could probably be an enum or something
    type: MessageType
    type: Strng
  }

`;

module.exports = typeDefs;