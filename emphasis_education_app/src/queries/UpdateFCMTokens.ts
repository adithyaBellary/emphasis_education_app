import gql from 'graphql-tag';

export const UPDATE_FCM_TOKENS = gql`
  mutation updateFCMDeviceTokens($email: String, $token: String) {
    updateFCMDeviceTokens(email: $email, token: $token) {
      res
      message
    }
  }
`