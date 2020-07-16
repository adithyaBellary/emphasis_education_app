import gql from 'graphql-tag';

export const SEND_MESSAGE = gql`
  mutation sendMessage($messages: [MessageInput]) {
    sendMessage(messages: $messages) {
      # text
      # MessageId
      # createdAt
      # user {
      #   name
      #   _id
      # }
      res
    }
  }
`;