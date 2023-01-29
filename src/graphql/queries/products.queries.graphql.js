import { GraphQLID, GraphQLList } from 'graphql';
import { ProductService } from '../../services/product.services.js';
import { ProductType, ProductUnionType } from '../typeDefs/products.typedefs.js';

const getProducts = {
  type: new GraphQLList(ProductType),
  resolve: async (_, args) => {
    try {
      const response = await ProductService.getAll();
      return response;
    } catch (error) {
      return error;
    }
  },
};

const getProductById = {
  type: ProductUnionType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (_, args) => {
    try {
      const { id } = args;
      const response = await ProductService.getById(id);
      if (response instanceof Error) return { status: response.status, message: response.message };
      return response;
    } catch (error) {
      return error;
    }
  },
};

export { getProducts, getProductById };
