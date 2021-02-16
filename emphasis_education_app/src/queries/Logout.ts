import gql from 'graphql-tag';

export const LOGOUT = gql`
  mutation logout($email: String!) {
    logout(email: $email) {
      res
    }
  }
`