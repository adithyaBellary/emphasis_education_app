// fieldName: (parent, args, context, info) => data;
const resolvers = {
  Query: {
    getMessages: (_, { id }, { dataSource }) => {
      return dataSource.getEverything();
    },
    test_q: (_, __, ___) => {
      return {
        name: 'hi',
        email: 'hihi'
      }
    }
  },

  Mutation: {
    login: (_, { email, password }, { dataSource }) => {
      // this is where we need to use the firebase functions
      dataSource.login(

      )
    }
  }
}

export default resolvers;