import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
  query getMessages($chatID: String!, $userID: String!, $refresh: Boolean) {
    getMessages(chatID: $chatID, userID: $userID, refresh: $refresh) {
      _id
      text
      createdAt
      user {
        _id
        name
      }
      image
      chatID
    }
  }
`;