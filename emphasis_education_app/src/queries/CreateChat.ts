import gql from 'graphql-tag';

// assign the chatID in the backend
export const CREATE_CHAT = gql`
  mutation createChat($chatName: String!, $className: String!, $tutorID: String!, $userIDs: [String]!) {
    createChat()
  }
`