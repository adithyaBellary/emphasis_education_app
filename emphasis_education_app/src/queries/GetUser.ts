import gql from 'graphql-tag';

export const GET_USER = gql`
  query getUser($userEmail: String!) {
    getUser(userEmail: $userEmail) {
      firstName
      lastName
      email
      phoneNumber
      userType
      _id
      classes {
        displayName
        className
        userInfo{
          firstName
          lastName
          email
        }
        tutorInfo {
          firstName
          lastName
          email
        }
        chatID
      }
      groupID
      adminChat {
        chatID
        user {
          firstName
          lastName
          email
        }
      }
      dob
    }
  }
`