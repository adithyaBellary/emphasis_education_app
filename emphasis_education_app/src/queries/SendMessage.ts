import gql from 'graphql-tag';

export const SEND_MESSAGE = gql`
  mutation sendMessage($messages: [MessageInput], $isAdminMessage: Boolean!) {
    sendMessage(messages: $messages, isAdminMessage: $isAdminMessage) {
      res
    }
  }
`;