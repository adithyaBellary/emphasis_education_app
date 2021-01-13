import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!, $token: String) {
    login(email: $email, password: $password, token: $token) {
      res
      user {
        email
        firstName
        lastName
      }
    }
  }
`;