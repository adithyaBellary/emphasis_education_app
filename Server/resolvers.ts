// fieldName: (parent, args, context, info) => data;
import pubsub from './pubsub';
import { MESSAGE_RECEIVED_EVENT } from './constants';

const resolvers = {
  Query: {
    getMessages: async (_, { id }, { dataSources }) => {
      const resp = await dataSources.f.getMessages(id);
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
      // console.log('in resolver sending message');
      const res =  await dataSources.f.sendMessages(messages);
      return res;
    },
    createUser: async (_, { email, password, userType }, { dataSources }) => {
      console.log('in resolver creaging user');
      // this adds the user to the firebase list of users
      await dataSources.f.createUser({email, password});
      await dataSources.f.pushUser({email, password}, userType);
      return true;
    }
  },

  Subscription: {
    messageReceived: {
      subscribe: () => {
        return pubsub.asyncIterator('somethingChanged')
      },
    }
  }
}

export default resolvers;