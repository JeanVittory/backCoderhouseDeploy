import { CartUnionTypes } from '../typeDefs/cart.typedefs.js';
import { CartService } from '../../services/cart.services.js';
import { GraphQLID } from 'graphql';
import { ProductService } from '../../services/product.services.js';

const createCart = {
  type: CartUnionTypes,
  resolve: async () => {
    try {
      const response = await CartService.createCart();
      return response;
    } catch (error) {
      return error;
    }
  },
};

const deleteCart = {
  type: CartUnionTypes,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args) => {
    try {
      const { id } = args;
      const response = await CartService.deleteById(id);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {
      return error;
    }
  },
};

const postProductOnCart = {
  type: CartUnionTypes,
  args: {
    productID: { type: GraphQLID },
    cartID: { type: GraphQLID },
  },
  resolve: async (_, args) => {
    try {
      const { productID, cartID } = args;
      const isProduct = await ProductService.getById(productID);
      if (isProduct instanceof Error)
        return { status: isProduct.status, message: isProduct.message };
      const response = await CartService.saveProductOnCart(cartID, isProduct);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {
      return error;
    }
  },
};

const deleteProductFromCart = {
  type: CartUnionTypes,
  args: {
    productID: { type: GraphQLID },
    cartID: { type: GraphQLID },
  },
  resolve: async (_, args) => {
    try {
      const { productID, cartID } = args;
      const isProduct = await ProductService.getById(productID);
      if (isProduct instanceof Error)
        return { status: isProduct.status, message: isProduct.message };
      const isCart = await CartService.getById(cartID);
      if (isCart instanceof Error) return { status: isCart.status, message: isCart.message };
      const response = await CartService.deleteProductFromCart(cartID, productID);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {
      return error;
    }
  },
};

export { createCart, deleteCart, postProductOnCart, deleteProductFromCart };
