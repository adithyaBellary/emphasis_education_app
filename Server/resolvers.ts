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
      await dataSources.f.createUser({email, password});
      return true;
    }

  }
}

export default resolvers;