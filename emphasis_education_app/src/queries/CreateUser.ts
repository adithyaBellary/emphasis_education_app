import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($email: String!, $password: String!, $userType: Permission!) {
    createUser(email: $email, password: $password, userType: $userType)
  }
`;
