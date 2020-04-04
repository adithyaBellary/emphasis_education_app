// fieldName: (parent, args, context, info) => data;
const resolvers = {
  Query: {
    getMessages: (_, { id }, { dataSource }) => {
      return dataSource.getEverything();
    }
  }
}

export default resolvers;