import gql from 'graphql-tag';

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      name
      userType
      groupID
    }
  }
`