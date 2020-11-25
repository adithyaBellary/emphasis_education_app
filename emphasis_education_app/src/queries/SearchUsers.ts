import gql from 'graphql-tag';

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!, $includeAdmin: Boolean) {
    searchUsers(searchTerm: $searchTerm, includeAdmin: $includeAdmin) {
      firstName
      lastName
      userType
      groupID
      _id
      email
    }
  }
`