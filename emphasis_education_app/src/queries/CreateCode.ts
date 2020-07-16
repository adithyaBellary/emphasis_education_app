import gql from 'graphql-tag';

export const CREATE_CODE = gql`
  mutation CreateCOde($email: String!) {
    createCode(email: $email) {
      res
    }
  }
`;
