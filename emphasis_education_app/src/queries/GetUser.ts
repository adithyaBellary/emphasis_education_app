import gql from 'graphql-tag';

export const GET_USER = gql`
  query getUser($userEmail: String!, $fcmToken: String) {
    getUser(userEmail: $userEmail, fcmToken: $fcmToken) {
      user {
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
      chatNotifications {
        chatID
        isAdmin
      }
    }
  }
`