import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';
import { ProductType } from './products.typedefs.js';

const CartType = new GraphQLObjectType({
  name: 'CartType',
  fields: {
    id: {
      type: GraphQLID,
    },
    product: {
      type: new GraphQLList(ProductType),
    },
  },
});

const isMutationOK = new GraphQLObjectType({
  name: 'isMutationOK',
  fields: {
    ok: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

const CartMessageError = new GraphQLObjectType({
  name: 'cartMessageError',
  fields: {
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  },
});

const CartUnionTypes = new GraphQLUnionType({
  name: 'CartUnionTypes',
  types: [CartType, isMutationOK, CartMessageError],
  resolveType: (value) => {
    if (value.ok) return isMutationOK;
    if (value.status) return CartMessageError;
    return CartType;
  },
});

export { CartUnionTypes };
