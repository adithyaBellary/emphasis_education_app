import gql from 'graphql-tag';

export const SUB = gql`
subscription {
  messageReceived {
    text
    MessageId
    createdAt
    user {
      name
      _id
    }
  }
}
`