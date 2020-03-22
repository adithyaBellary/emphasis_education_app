// const { gql } = require('react-apollo');
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    getMessage(id: ID): message
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

  # should make a person type that could either be a student, teacher, or admin

  type subject {
    id: ID!
    name: String!
    desc: String!
  }

  # type message {
  #   id: ID!
  #   content: String!
  #   to: String!
  #   from: String!
  #   # what date/time types do we have
  #   timestamp: date
  #   # this could probably be an enum or something
  #   # type: MessageType
  #   type: Strng
  # }
  type message {
    id: ID!
    content: String!
  }

`;

// module.exports = typeDefs;