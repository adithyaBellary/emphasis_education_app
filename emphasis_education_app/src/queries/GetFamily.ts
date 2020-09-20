import gql from 'graphql-tag';

export const GET_FAMILY = gql`
  query GetFamily($groupID: String!) {
    getFamily(groupID: $groupID) {
      firstName
      lastName
      email
      groupID
      phoneNumber
      _id
      dob
      classes {
        className
      }
      userType
    }
  }
`