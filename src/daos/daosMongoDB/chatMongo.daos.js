import mongoose from 'mongoose';
import { logger } from '../../config/logger/index.js';
import { doMongoConnection } from '../../config/mongodb.config.js';
import { normalizeChatMessage } from '../../tools/normalizr.tools.js';

let instance = null;

class ChatMongoService {
  #collection;
  constructor(collectionName, schema) {
    this.#collection = mongoose.model(collectionName, schema);
  }

  static getInstance(collectionName, schema) {
    if (!instance) {
      instance = new ChatMongoService(collectionName, schema);
    }
    return instance;
  }

  async getAllMessages() {
    try {
      const db = await doMongoConnection();
      const allMessages = await this.#collection.find();
      await db.close();
      const dataToNormalize = {
        id: 'messages',
        messages: [...allMessages],
      };
      const initialDataWeigth = JSON.stringify(dataToNormalize).length;
      const dataNormalized = normalizeChatMessage(dataToNormalize);
      return {
        dataToDenormalize: dataNormalized,
        initialWeigth: initialDataWeigth,
      };
    } catch (error) {
      logger.error(error);
    }
  }

  async addMessage(message) {
    try {
      if (message) {
        const db = await doMongoConnection();
        const newMessage = new this.#collection(message);
        await newMessage.save();
        await db.close();
        return {};
      }
    } catch (error) {
      logger.error(error);
    }
  }
}

export { ChatMongoService };
