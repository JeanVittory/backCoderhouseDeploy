import { serviceProductDB } from '../factory/factoryDaos.js';
import env from '../config/env.config.js';

class ProductService {
  constructor() {}

  static async save(newProduct) {
    const productAddedResponse = await serviceProductDB.save(newProduct);
    return productAddedResponse;
  }

  static async getAll() {
    const productRetrieved = await serviceProductDB.getAll();
    return productRetrieved;
  }

  static async getByName(nameProduct) {
    const productRetrieved = await serviceProductDB.getByName(nameProduct);
    return productRetrieved;
  }

  static async getById(id) {
    try {
      const productRetrieved = await serviceProductDB.getById(id);
      if (productRetrieved instanceof Error) throw productRetrieved;
      return productRetrieved;
    } catch (error) {
      return error;
    }
  }

  static async updateById(id, dataToUpdate) {
    try {
      const responseFromUpdate = await serviceProductDB.updateById(id, dataToUpdate);
      if (responseFromUpdate instanceof Error) throw responseFromUpdate;
      if (env.DATABASE_TO_USE === 'mongo') return responseFromUpdate.modifiedCount;
      return responseFromUpdate;
    } catch (error) {
      return error;
    }
  }

  static async deleteById(idProduct) {
    try {
      const responseFromDelete = await serviceProductDB.deleteById(idProduct);
      if (responseFromDelete instanceof Error) throw responseFromDelete;
      return responseFromDelete;
    } catch (error) {
      return error;
    }
  }

  static async getProductsByCategory(category) {
    try {
      const response = await serviceProductDB.getProductsByCategory(category);
      if (response instanceof Error) throw response;
      return response;
    } catch (error) {
      return error;
    }
  }

  static async deleteAll() {
    try {
      await serviceProductDB.deleteAll();
    } catch (error) {
      return error;
    }
  }
}

export { ProductService };
