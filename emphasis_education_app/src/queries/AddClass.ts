import gql from 'graphql-tag';

export const ADD_CLASS = gql`
  mutation AddClass($className: String!) {
    addClass(className: $className) {
      res
      message
    }
  }
`;
