import gql from 'graphql-tag';

export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    res
    user {
      name
      email
      phoneNumber
      userType
      groupID
      _id
      chatIDs
      gender
      classes {
        className
        chatID
      }
    }
  }
}
`;