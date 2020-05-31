import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
query getMessages($chatID: String!, $init: Int!) {
  getMessages(chatID: $chatID, init: $init) {
    # id
    _id
    text
    createdAt
    user {
      _id
      name
    }
  }
}
`;