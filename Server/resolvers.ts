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
      // let res: boolean = false;
      const res: boolean = dataSources.f.login(
        {
          email,
          password
        },
        // () => res = true,
        // () => res = false
        // success_callback,
        // error_callback
      )
      return res
    }
  }
}

export default resolvers;