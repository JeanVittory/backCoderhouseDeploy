import { serviceOrders } from '../factory/factoryDaos.js';

class OrderService {
  constructor() {}

  static async addOrder(data) {
    try {
      const response = await serviceOrders.addOrder(data);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export { OrderService };
