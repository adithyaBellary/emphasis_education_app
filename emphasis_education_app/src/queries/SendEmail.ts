import gql from 'graphql-tag';

export const SEND_EMAIL = gql`
  mutation SendEmail($subject: String!, $body: String!){
    sendEmail(subject: $subject, body: $body){
      res
    }
  }
`