// import gql from 'graphql-tag';
import { gql } from '@apollo/client';

export const SUB = gql`
  subscription MessageReceived {
    messageReceived {
      text
      _id
      createdAt
      user {
        name
        _id
      }
      image
      chatID
    }
  }
`