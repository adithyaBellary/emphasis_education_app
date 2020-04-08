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
      // console.log('we in the mutation')
      // console.log(dataSources)
      // let res: boolean = false;
      const res: boolean = await dataSources.f.login(
        {
          email,
          password
        },
      )
      return res
    },
    sendMessage: async (_, { messages }, { dataSources }) => {
      console.log('in resolver sending message');
      await dataSources.f.sendMessages(messages);

      return true;
    }

  }
}

export default resolvers;