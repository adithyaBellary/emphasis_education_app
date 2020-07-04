import gql from 'graphql-tag';

export const GET_USER = gql`
  query getUser($userEmail: String!) {
    getUser(userEmail: $userEmail) {
      name
      email
      phoneNumber
      userType
      _id
      chatIDs
      classes {
        chatID
      }
      groupID
      gender
    }
  }
`