import gql from 'graphql-tag';

export const SEND_BUG_EMAIL = gql`
  mutation SendBugEmail($user: String!, $body: String!) {
    sendBugEmail(user: $user, body: $body) {
      res
    }
  }
`;
