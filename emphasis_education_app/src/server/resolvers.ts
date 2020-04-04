// fieldName: (parent, args, context, info) => data;
export const resolvers = {
  Query: {
    getMessages: (_, __, { dataSource }) => {
      dataSource.getEverything()
    }
  }
}