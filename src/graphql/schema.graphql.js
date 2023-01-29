import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { getProducts, getProductById } from './queries/products.queries.graphql.js';
import { postProduct, deleteProduct, updateProduct } from './mutations/products.mutations.js';
import {
  createCart,
  deleteCart,
  postProductOnCart,
  deleteProductFromCart,
} from './mutations/cart.mutations.graphql.js';
import { getProductsFromCart } from './queries/cart.queries.graphql.js';

const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getProducts,
    getProductById,
    getProductsFromCart,
  },
});

const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    postProduct,
    deleteProduct,
    updateProduct,
    createCart,
    deleteCart,
    postProductOnCart,
    deleteProductFromCart,
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

export { schema };
