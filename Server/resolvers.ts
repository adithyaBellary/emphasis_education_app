// fieldName: (parent, args, context, info) => data;
import pubsub from './pubsub';

const resolvers = {
  Query: {
    getMessages: async (_, { id }, { dataSources }) => {
      const resp = await dataSources.f.getMessages(id);
      return resp;
    },
    test_q: (_, {test}, ___) => {
      return {
        name: test ? 'yes' : 'no',
        email: 'hihi'
      }
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
      console.log('in resolver sending message');
      return await dataSources.f.sendMessages(messages);
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
    somethingChanged: {
      subscribe: () => {
        return pubsub.asyncIterator('somethingChanged')
      },
    }
  }
}

export default resolvers;