import gql from 'graphql-tag';

export const GET_FAMILY = gql`
  query GetFamily($groupID: String!) {
    getFamily(groupID: $groupID) {
      name
      email
      groupID
      phoneNumber
    }
  }
`