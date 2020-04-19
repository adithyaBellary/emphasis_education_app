// fieldName: (parent, args, context, info) => data;
import pubsub from './pubsub';

const resolvers = {
  Query: {
    getMessages: (_, { id }, { dataSources }) => {
      return dataSources.getEverything();
    },
    test_q: (_, __, ___) => {
      return {
        name: 'hi',
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
      const res: boolean = await dataSources.f.login(
        {
          email,
          password
        },
      )
      return res
    },
    sendMessage: async (_, { messages }, { dataSources }) => {
      // console.log('in resolver sending message');

      return await dataSources.f.sendMessages(messages);
    },
    createUser: async (_, { email, password, userType }, { dataSources }) => {
      console.log('in resolver creaging user');
      // console.log(typeof userType);
      // this adds the user to the firebase list of users
      await dataSources.f.createUser({email, password});
      await dataSources.f.pushUser({email, password}, userType);
      return true;
    }
  },

  Subscription: {
    somethingChanged: {
      subscribe: () => {
        console.log('in the sub resolver')
        return pubsub.asyncIterator('somethingChanged')
      },
    }
  }
}

export default resolvers;