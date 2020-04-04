// const { gql } = require('apollo-server');
// import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    getMessage(id: ID): message
    # gotta work on this me query
    me: User
  }

  type Mutation {
    # not sure about this
    writeMessage(id: number): writeMessageResponse!
  }

  # good practice for a mutation to return whatever it is updating so
  # that the client can update cache and stuff
  type writeMessageResponse {
    success: Boolean!
    message: String!
  }

  type User {
    name: String!
    email: String!
    password: String!
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

module.exports = typeDefs;
