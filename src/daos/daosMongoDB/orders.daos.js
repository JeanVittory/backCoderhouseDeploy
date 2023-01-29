import { doMongoConnection } from '../../config/mongodb.config.js';
import mongoose from 'mongoose';

let instance = null;

class Orders {
  #collection;
  constructor(collectionName, schema) {
    this.#collection = mongoose.model(collectionName, schema);
  }

  static getInstace(collectionName, schema) {
    if (!instance) {
      instance = new Orders(collectionName, schema);
    }
    return instance;
  }

  async addOrder(data) {
    try {
      await doMongoConnection();
      const order = new this.#collection(data);
      const orderAdded = await order.save();
      return orderAdded;
    } catch (error) {
      return error;
    }
  }
}

export { Orders };
