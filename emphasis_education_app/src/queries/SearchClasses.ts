import gql from 'graphql-tag';

export const SEARCH_CLASSES = gql`
  query SearchClasses($searchTerm: String!) {
    searchClasses(searchTerm: $searchTerm) {
      name
    }
  }
`
