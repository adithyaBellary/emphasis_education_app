import gql from 'graphql-tag';

// assign the chatID in the backend
export const CREATE_CHAT = gql`
  mutation createChat($displayName: String!, $className: String!, $tutorInfo: ChatUserInfoInput!, $userInfo: [ChatUserInfoInput!]!) {
    createChat(displayName: $displayName, className: $className, tutorInfo: $tutorInfo, userInfo: $userInfo) {
      res
    }
  }
`