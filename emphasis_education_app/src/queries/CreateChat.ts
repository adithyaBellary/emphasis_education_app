import gql from 'graphql-tag';

// assign the chatID in the backend
export const CREATE_CHAT = gql`
  mutation createChat($displayName: String!, $className: String!, $tutorEmail: String!, $userEmails: [String!]!) {
    createChat(displayName: $displayName, className: $className, tutorEmail: $tutorEmail, userEmails: $userEmails) {
      res
    }
  }
`