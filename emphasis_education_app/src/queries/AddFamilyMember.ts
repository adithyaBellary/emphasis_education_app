import gql from 'graphql-tag';

export const ADD_FAMILY_MEMBER = gql`
  mutation AddFamilyMember($familyID: String!, $userEmails: [String!]!) {
    addFamilyMember(familyID: $familyID, userEmails: $userEmails) {
      res
      family {
        _id
        firstName
        lastName
        email
        phoneNumber
        gender
        userType
        classes {
          className
        }
      }
    }
  }
`;
