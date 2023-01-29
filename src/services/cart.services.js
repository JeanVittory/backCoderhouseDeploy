import { serviceCartDB } from '../factory/factoryDaos.js';

class CartService {
  constructor() {}

  static async createCart() {
    try {
      const productAddedResponse = await serviceCartDB.createCart();
      if (productAddedResponse instanceof Error) throw productAddedResponse;
      return productAddedResponse;
    } catch (error) {
      return error;
    }
  }

  static async getById(id) {
    try {
      const productRetrieved = await serviceCartDB.getById(id);
      if (productRetrieved instanceof Error) throw productRetrieved;
      return productRetrieved;
    } catch (error) {
      return error;
    }
  }

  static async saveProductOnCart(idCart, newProduct) {
    try {
      const responseFromSaveProduct = await serviceCartDB.saveProductOnCart(idCart, newProduct);
      if (responseFromSaveProduct instanceof Error) throw responseFromSaveProduct;
      return responseFromSaveProduct;
    } catch (error) {
      return error;
    }
  }

  static async deleteProductFromCart(idCart, idProduct) {
    try {
      const responseFromDelete = await serviceCartDB.deleteProductFromCart(idCart, idProduct);
      if (responseFromDelete instanceof Error) throw responseFromDelete;
      return responseFromDelete;
    } catch (error) {
      return error;
    }
  }

  static async deleteById(id) {
    try {
      const responseFromDelete = await serviceCartDB.deleteById(id);
      if (responseFromDelete instanceof Error) throw responseFromDelete;
      return responseFromDelete;
    } catch (error) {
      return error;
    }
  }
}

export { CartService };
