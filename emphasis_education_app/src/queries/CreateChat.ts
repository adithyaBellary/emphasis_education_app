import gql from 'graphql-tag';

// assign the chatID in the backend
export const CREATE_CHAT = gql`
  mutation createChat($displayName: String!, $className: String!, $tutorEmail: String!, $userInfo: [ChatUserInfoInput!]!) {
    createChat(displayName: $displayName, className: $className, tutorEmail: $tutorEmail, userInfo: $userInfo) {
      res
    }
  }
`