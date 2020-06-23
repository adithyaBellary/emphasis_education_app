import gql from 'graphql-tag';

export const CHECK_LOGGED_IN = gql`
  query CheckLoggedIn {
    checkLoggedIn {
      loggedIn
      user {
        name
        email
        phoneNumber
        userType
        _id
        chatIDs
        classes {
          displayName
          className
          userEmails
          tutorEmail
          chatID
        }
        groupID
        gender
      }
    }
  }
`