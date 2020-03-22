// fieldName: (parent, args, context, info) => data;
export const resolvers = {
  Query: {
    getMessage: (_, { id }, { dataSource }) => {
      dataSource.getData(id)
    }
  }
}