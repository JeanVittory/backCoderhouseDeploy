import { GraphQLInt, GraphQLString, GraphQLID } from 'graphql';
import {
  ProductType,
  ProductUnionType,
  UpdatedMessageAndErrors,
} from '../typeDefs/products.typedefs.js';
import { ProductService } from '../../services/product.services.js';

const postProduct = {
  type: ProductType,
  args: {
    productName: { type: GraphQLString },
    price: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      const { name, productName, price, thumbnail } = args;
      const newProduct = { name, productName, price, thumbnail };
      const response = await ProductService.save(newProduct);
      return { ...args, id: response.toHexString() };
    } catch (error) {
      return error;
    }
  },
};

const updateProduct = {
  type: UpdatedMessageAndErrors,
  args: {
    id: { type: GraphQLID },
    productName: { type: GraphQLString },
    price: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      const product = {
        productName: args.productName || null,
        price: args.price || null,
        thumbnail: args.thumbnail || null,
      };
      const response = await ProductService.updateById(args.id, product);
      if (response instanceof Error) return { status: response.status, message: response.message };
      if (response < 1) return { message: 'Something went wrong' };
      return { message: 'Product updated' };
    } catch (error) {
      return error;
    }
  },
};

const deleteProduct = {
  type: ProductUnionType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args) => {
    const { id } = args;
    try {
      const response = await ProductService.deleteById(id);
      console.log(response);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {
      return error;
    }
  },
};

export { postProduct, deleteProduct, updateProduct };
