import gql from 'graphql-tag';

export const SUB = gql`
  subscription MessageReceived {
    messageReceived {
      text
      _id
      createdAt
      user {
        name
        _id
      }
      image
      chatID
    }
  }
`