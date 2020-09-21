import gql from 'graphql-tag';

export const ADD_CHAT_MEMBER = gql`
  mutation AddChatMember($email: String!, $chatID: String!) {
    addChatMember(email: $email, chatID: $chatID) {
      res
    }
  }
`;