import gql from 'graphql-tag';

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    res
  }
}
`