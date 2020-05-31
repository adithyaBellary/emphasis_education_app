import { gql } from 'apollo-server';

const typeDefs = gql`

  input MessageInput {
    id: String!
    text: String!
    user: MessageUserInput!
    chatID: String!
  }
  # this is made to work with the gifted chat user type that it is expecting
  input MessageUserInput {
    name: String!
    email: String!
    _id: String
  }

  type MessagePayload {
    text: String!
    MessageId: Int!
    createdAt: String!
    user: MessageUser!
  }

  type MessageUser {
    _id: String!
    name: String!
    email: String!
  }

  type MessageType {
    # id: ID
    _id: String!
    text: String!
    createdAt: String!
    user: MessageUser!
  }

  # lets make this similar to UserInfoType
  type TestUser {
    _id: String!
    email: String!
    password: String!
    userType: Permission!
    chatIDs: [String]!
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
    # basically UserInfoType from here down
    name: String!
    email: String!
    phoneNumber: String!
    userType: Permission!
    groupID: String!
    _id: String!
    chatIDs: [String]!
  }

  # this might need some connection to the other members of the family
  # array of strings that are the emails of the fam members

  # lets use this type for the input to the createUser function
  # members: [String]!
  input UserInputType {
    name: String!
    email: String!
    password: String!
    userType: Permission!
    phoneNumber: String!
  }

  # maybe we can add an optional info field too

  # this type will be for what we want to query for when we represent data on the frontend
  # these are fields that will be written to the db
  type UserInfoType {
    name: String!
    email: String!
    phoneNumber: String!
    userType: Permission!
    _id: String!
    chatIDs: [String]!
    # all members of the same group
    groupID: String!
  }

  # type UserInfoTypeArr {
  #   users: [UserInfoType]!
  # }

  type CreateUserPayload {
    success: Boolean
  }

  type Query {
    getMessages(chatID: String, init: Int!): [MessageType]
    getUserID: String
    # lets return UserInfoType insgead
    getUser(id: String!): TestUser
    getFamily(groupID: String!): [UserInfoType]
    searchUsers(searchTerm: String!): [UserInfoType]!
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
    sendMessage(messages: [MessageInput]): MessagePayload!
    # createUser will need to take an array of users to create
    # createUser(email: String!, password: String!, userType: Permission!): Boolean

    createUser(users: [UserInputType]): CreateUserPayload

    # needs to be written
    # add chats to a student
    # change classes
    # change tutor
    # add offered classes
    # change the members of the family
    addClass(subject: String!): Boolean

  }

  type Subscription {
    messageReceived: MessagePayload!
  }
`;

export default typeDefs;
