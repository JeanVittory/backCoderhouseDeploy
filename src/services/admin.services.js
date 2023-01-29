import { serviceRegisterAdmin } from '../factory/factoryDaos.js';

class ServiceAdmin {
  constructor() {}

  static async addUser(user) {
    const userAddedRsponse = await serviceRegisterAdmin.addUser(user);
    return userAddedRsponse;
  }

  static async userExist(usernameToFind, emailToFind) {
    const responseFromExistUser = await serviceRegisterAdmin.userExist(usernameToFind, emailToFind);
    return responseFromExistUser;
  }

  static async getUserById(id) {
    const admin = serviceRegisterAdmin.getUserById(id);
    return admin;
  }

  static async getUserByUsername(username) {
    const admin = serviceRegisterAdmin.getUserByUsername(username);
    return admin;
  }

  static async getPassword(username) {
    const pwd = await serviceRegisterAdmin.getPassword(username);
    return pwd;
  }
}

export { ServiceAdmin };
