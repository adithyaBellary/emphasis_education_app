import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($users: [UserInputType]) {
    createUser(email: $users) {
      success
    }
  }
`;
