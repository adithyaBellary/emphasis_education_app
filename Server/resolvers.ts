// fieldName: (parent, args, context, info) => data;
import pubsub from './pubsub';
import { MESSAGE_RECEIVED_EVENT } from './constants';
import { UserInputType } from './types/schema-types';

const resolvers = {
  Query: {
    getMessages: async (_, { chatID, init }, { dataSources }) => {
      const resp = await dataSources.f.getMessages(chatID, init);
      return resp;
    },
    getUserID: (_, __, { dataSources }) => {
      return dataSources.f.getID();
    },
    getUser: (_, { id }, { dataSources }) => {
      return dataSources.f.getUser(id);
    }
  },

  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      const response = await dataSources.f.login(
        {
          email,
          password
        },
      )
      return response
    },
    sendMessage: async (_, { messages }, { dataSources }) => {
      const res = await dataSources.f.sendMessages(messages);
      return res;
    },
    createUser: async (_, users: UserInputType[], { dataSources }) => {
      console.log('in resolver creating user', users);
      users.forEach(async (element: UserInputType) => {
        // this adds the user to the firebase list of users
        await dataSources.f.createUser(element.email, element.password, element.name);
        // this adds user to the db
        // await dataSources.f.pushUser({email, password}, userType);
      });
      return true;
    }
  },

  Subscription: {
    messageReceived: {
      subscribe: () => {
        return pubsub.asyncIterator(MESSAGE_RECEIVED_EVENT)
      },
    }
  }
}

export default resolvers;