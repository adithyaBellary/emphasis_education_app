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
  }

  type Mutation {
    login(email: String!, password: String!): Boolean
    signup(email: String!, password: String!): User

    sendMessage(messages: [MessageTypeInput]): Boolean
  }
`;

export default typeDefs;
