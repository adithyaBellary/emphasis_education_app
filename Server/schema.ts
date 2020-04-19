import { gql } from 'apollo-server';

const typeDefs = gql`

  input MessageTypeInput {
    id: String!
    text: String!
    user: UserInput!
    # createdAt: Date!
  }

  type MessagePayload {
    _id: String!
    text: String!
    MessageId: Int!
    name: String!
  }

  input UserInput {
    name: String!
    email: String!
    _id: String
  }

  type MessageType {
    id: ID!
    text: String!
    user: User!
  }

  type User {
    name: String!
    email: String!
    # _id: String
  }

  type TestUser {
    _id: String!
    email: String!
    password: String!
    userType: Permission!
  }

  enum Permission {
    Student
    Tutor
    Admin
  }

  enum Classes {
    Math
    Science
    History
  }

  type Query {
    getMessages(id: ID): MessageType
    test_q: User!
    getUserID: String
    getUser(id: String!): TestUser
    # still have to write

    # make an enum for the classes?
    # sounds like a good idea because they should be a part of a predetermined list
    getClasses: [String]
    # getting the current user
    # get ID when we query on email
    queryUserID(email: String): Int
  }

  type Mutation {
    login(email: String!, password: String!): Boolean
    # sendMessage(messages: [MessageTypeInput]): Boolean
    sendMessage(messages: [MessageTypeInput]): MessagePayload
    # what needs to be written still
    # do i need to write a mutation to
    createUser(email: String!, password: String!, userType: Permission!): Boolean
  }

  type Subscription {
    somethingChanged: User
  }
`;

export default typeDefs;
