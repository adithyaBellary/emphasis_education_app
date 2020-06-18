import gql from 'graphql-tag';

export const CHECK_LOGGED_IN = gql`
  query CheckLoggedIn {
    checkLoggedIn {
      loggedIn
    }
  }
`