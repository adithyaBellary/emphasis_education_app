import { gql } from 'apollo-server';

const typeDefs = gql`

  input MessageTypeInput {
    id: String!
    text: String!
    user: UserInput!
    chatID: String!
  }

  type MessagePayload {
    # _id: String!
    text: String!
    MessageId: Int!
    # name: String!
    createdAt: String!
    currentUser: MessageUser!
  }

  input UserInput {
    name: String!
    email: String!
    _id: String
  }

  type MessageUser {
    _id: String!
    name: String!
    email: String!
  }

  type MessageType {
    _id: String!
    text: String!
    createdAt: String!
    user: MessageUser!
  }

  type User {
    name: String!
    email: String!
  }

  type TestUser {
    _id: String!
    email: String!
    password: String!
    userType: Permission!
    chatIDs: [String]!
  }

  type TestUserwChat {
    chatIds: [String]!
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

  type LoginPayload {
    res: Boolean!
    chatIDs: [String]!
  }

  type Query {
    getMessages(id: String): [MessageType]
    test_q(test: Boolean!): User!
    getUserID: String
    getUser(id: String!): TestUser
    # still have to write

    # make an enum for the classes?
    # sounds like a good idea because they should be a part of a predetermined list
    getClasses: [String]
    # getting the current user
    # get ID when we query on email
    queryUserID(email: String): Int

    # needs to be written
    # get all classes
  }

  type Mutation {
    login(email: String!, password: String!): LoginPayload
    sendMessage(messages: [MessageTypeInput]): MessagePayload!
    createUser(email: String!, password: String!, userType: Permission!): Boolean

    # needs to be written
    # add chats to a student
    # change classes
    # change tutor

  }

  type Subscription {
    somethingChanged: User
  }
`;

export default typeDefs;
