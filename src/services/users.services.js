import { serviceRegisterUsers } from '../factory/factoryDaos.js';

class ServiceUsers {
  constructor() {}

  static async addUser(newDataUser) {
    const userAddedResponse = await serviceRegisterUsers.addUser(newDataUser);

    return userAddedResponse;
  }

  static async userExist(usernameToFind, emailToFind) {
    const responseFromExistUser = await serviceRegisterUsers.userExist(usernameToFind, emailToFind);
    return responseFromExistUser;
  }

  static async getUserById(id) {
    const admin = serviceRegisterUsers.getUserById(id);
    return admin;
  }

  static async getUserByUsername(username) {
    const admin = serviceRegisterUsers.getUserByUsername(username);
    return admin;
  }

  static async getPassword(username) {
    const pwd = await serviceRegisterUsers.getPassword(username);
    return pwd;
  }
}

export { ServiceUsers };
