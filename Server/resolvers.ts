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
    login: (_, {email, password}, { dataSources }) => {
      console.log('we in the mutation')
      console.log(dataSources)
      dataSources.f.login(
        {
          email,
          password
        },
        () => console.log('success'),
        () => console.log('fail')
        // success_callback,
        // error_callback
      )
      return 'done logging in???'
    }
  }
}

export default resolvers;