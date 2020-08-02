import gql from 'graphql-tag';

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatID: String!) {
    deleteChat(chatID: $chatID) {
      res
    }
  }
`;