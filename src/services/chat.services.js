import { serviceChatDB } from '../factory/factoryDaos.js';

class ChatService {
  constructor() {}

  static async getAllMessages() {
    const chatMessages = await serviceChatDB.getAllMessages();
    return chatMessages;
  }

  static async addMessage(message) {
    try {
      await serviceChatDB.addMessage(message);
      return;
    } catch (error) {
      return error;
    }
  }
}

export { ChatService };
