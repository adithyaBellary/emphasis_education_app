// fieldName: (parent, args, context, info) => data;
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
      await dataSources.f.sendMessages(messages);

      return true;
    },
    createUser: async (_, { email, password }, { dataSources }) => {
      console.log('in resolver creaging user');
      // this adds the user to the firebase list of users
      await dataSources.f.createUser({email, password});
      await dataSources.f.pushUser({email, password});
      return true;
    }

  }
}

export default resolvers;