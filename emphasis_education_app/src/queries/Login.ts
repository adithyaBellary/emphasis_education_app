import gql from 'graphql-tag';

export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    res
    name
    email
    phoneNumber
    userType
    groupID
    _id
    chatIDs
    classes {
      className
    }
  }
}
`;