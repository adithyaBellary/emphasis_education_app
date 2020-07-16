import gql from 'graphql-tag';

export const CHECK_CODE = gql`
  query CheckCode($email: String!, $code: String!){
    checkCode(email: $email, code: $code) {
      res
    }
  }
`;
