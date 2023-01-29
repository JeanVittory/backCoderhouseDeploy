import { GraphQLID } from 'graphql';
import { CartService } from '../../services/cart.services.js';
import { CartUnionTypes } from '../typeDefs/cart.typedefs.js';

const getProductsFromCart = {
  type: CartUnionTypes,
  args: {
    cartID: {
      type: GraphQLID,
    },
  },
  resolve: async (_, args) => {
    try {
      const { cartID } = args;
      const response = await CartService.getById(cartID);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {}
  },
};

export { getProductsFromCart };
