import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql';

const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: {
    id: {
      type: GraphQLID,
    },
    productName: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLInt,
    },
    thumbnail: {
      type: GraphQLString,
    },
  },
});

const ProductMessageError = new GraphQLObjectType({
  name: 'ProductError',
  fields: {
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  },
});

const ProductUpdatedOK = new GraphQLObjectType({
  name: 'ProductUpdatedMessage',
  fields: {
    message: { type: GraphQLString },
  },
});

const ProductUnionType = new GraphQLUnionType({
  name: 'ProductAndErrors',
  types: [ProductMessageError, ProductType],
  resolveType: (value) => {
    if (value.status) return ProductMessageError;
    return ProductType;
  },
});

const UpdatedMessageAndErrors = new GraphQLUnionType({
  name: 'MessageUpdateAndErrors',
  types: [ProductMessageError, ProductUpdatedOK],
  resolveType: (value) => {
    if (value.status) return ProductMessageError;
    return ProductUpdatedOK;
  },
});

export { ProductType, ProductMessageError, ProductUnionType, UpdatedMessageAndErrors };
