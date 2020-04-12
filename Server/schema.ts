import { gql } from 'apollo-server';

const typeDefs = gql`

  input MessageTypeInput {
    id: String!
    text: String!
    user: UserInput!
    # createdAt: Date!
  }

  input UserInput {
    name: String!
    email: String!
  }

  type MessageType {
    id: ID!
    text: String!
    user: User!
    # createdAt: Date!
  }

  type User {
    name: String!
    email: String!
  }

  type Query {
    getMessages(id: ID): MessageType
    test_q: User!
    getUserID: String
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
    sendMessage(messages: [MessageTypeInput]): Boolean
    # what needs to be written still
    createUser(email: String!, password: String!): Boolean
  }

  type Subscription {
    somethingChanged: User
  }
`;

export default typeDefs;
