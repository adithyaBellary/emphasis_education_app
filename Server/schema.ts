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
    # getting the UID
    # getting the current user
  }

  type Mutation {
    login(email: String!, password: String!): Boolean
    sendMessage(messages: [MessageTypeInput]): Boolean
    # what needs to be written still
    signup(email: String!, password: String!): User

  }
`;

export default typeDefs;
