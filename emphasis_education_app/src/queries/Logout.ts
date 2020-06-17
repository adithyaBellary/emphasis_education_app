import gql from 'graphql-tag';

export const Logout = gql`
  mutation Logout {
    logout {
      success
    }
  }
`