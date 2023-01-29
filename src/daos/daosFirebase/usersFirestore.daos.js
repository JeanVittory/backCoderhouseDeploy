import { appFirestore } from '../../config/firebase/products.firebase.config.js';
import { ErrorHandler } from '../../tools/errorHandler.tools.js';
import { AdminDTO } from '../../dto/firebase/adminDto.js';

let instance = null;

class UserFirebaseDao {
  constructor(nameCollection) {
    this.nameCollection = nameCollection;
  }

  static getInstance(nameCollection) {
    if (!instance) {
      instance = new UserFirebaseDao(nameCollection);
    }
    return instance;
  }

  async addUser(user) {
    try {
      if (user) {
        const db = appFirestore.firestore();
        const responseFromAdd = await db.collection(this.nameCollection).add(user);
        return responseFromAdd.id;
      }
    } catch (error) {
      return error;
    }
  }

  async userExist(usernameToFind, emailToFind = 1) {
    try {
      if (usernameToFind && emailToFind) {
        const db = appFirestore.firestore();
        const responseFromExistUser = await db
          .collection(this.nameCollection)
          .where('username', '==', usernameToFind)
          .get();
        if (responseFromExistUser.empty) {
          return null;
        }
        let user;
        responseFromExistUser.forEach((doc) => {
          user = { id: doc.id, ...doc.data() };
        });
        const userFormatted = { ...new AdminDTO(user) };
        return userFormatted;
      }
    } catch (error) {
      return error;
    }
  }

  async getUserById(id) {
    try {
      if (id) {
        const db = appFirestore.firestore();
        const responseFromGetById = await db.collection(this.nameCollection).doc(id).get();
        if (!responseFromGetById.exists) {
          throw new ErrorHandler({
            status: 404,
            message: "The user doesn't exist",
          });
        }
        const userFormmated = {
          ...new AdminDTO({ id: responseFromGetById.id, ...responseFromGetById.data() }),
        };
        return userFormmated;
      }
    } catch (error) {
      return error;
    }
  }

  async getUserByUsername(username) {
    try {
      if (username) {
        const db = appFirestore.firestore();
        const responseFromGetUser = await db
          .collection(this.nameCollection)
          .where('username', '==', username)
          .get();

        if (responseFromGetUser.empty) {
          throw new ErrorHandler({
            status: 404,
            message: 'The user not exist',
          });
        }
        let user;
        responseFromGetUser.forEach((doc) => {
          user = { id: doc.id, ...doc.data() };
        });
        const userFormatted = { ...new AdminDTO(user) };
        return userFormatted;
      }
    } catch (error) {
      return error;
    }
  }

  async getPassword(usernameToFind) {
    try {
      if (usernameToFind) {
        const db = appFirestore.firestore();
        const userExist = await db
          .collection(this.nameCollection)
          .where('username', '==', usernameToFind)
          .get();
        if (userExist.empty) {
          throw new ErrorHandler({
            status: 404,
            message: 'The user not exist',
          });
        }
        let pwd;
        userExist.forEach((doc) => (pwd = doc.data().password));
        return pwd;
      }
    } catch (error) {
      return error;
    }
  }
}

export { UserFirebaseDao };
