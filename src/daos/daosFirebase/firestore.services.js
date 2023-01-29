import { appFirestore } from '../../config/firebase/products.firebase.config.js';
import { ErrorHandler } from '../../tools/errorHandler.tools.js';
import { productsDTO } from '../../dto/firebase/productDto.dto.js';

class FirestoreService {
  constructor(nameCollection) {
    this.nameCollection = nameCollection;
  }

  async save(product) {
    try {
      const db = appFirestore.firestore();
      const responsefromAdd = await db.collection(this.nameCollection).add(product);
      return responsefromAdd.id;
    } catch (error) {
      return error;
    }
  }

  async getAll() {
    try {
      const db = appFirestore.firestore();
      const snapShot = await db.collection(this.nameCollection).get();
      let productsRetrieved = [];
      snapShot.forEach((doc) => {
        productsRetrieved.push({ id: doc.id, ...doc.data() });
      });
      if (this.nameCollection === 'products') {
        const responseProductDto = productsDTO(productsRetrieved);
        return responseProductDto;
      }
      return productsRetrieved;
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    try {
      const db = appFirestore.firestore();
      const responseFromGetById = await db.collection(this.nameCollection).doc(id).get();
      if (!responseFromGetById.exists) {
        throw new ErrorHandler({
          status: 404,
          message: "The product or cart doesn't exist in database",
        });
      }
      const product = { id: responseFromGetById.id, ...responseFromGetById.data() };
      if (this.nameCollection === 'products') {
        const responseProductDto = productsDTO(product);
        return responseProductDto;
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  async getByName(productName) {
    try {
      const db = appFirestore.firestore();
      const isInDb = await db
        .collection(this.nameCollection)
        .where('productName', '==', productName)
        .get();
      if (isInDb.empty) {
        throw new ErrorHandler({
          status: 500,
          message:
            'A error occurred adding your product, please refresh your page meanwhile our team fix the problem',
        });
      }
      let productRetrieved;
      isInDb.forEach((doc) => {
        productRetrieved = { id: doc.id, ...doc.data() };
      });
      if (this.nameCollection === 'products') {
        const responseProductDto = productsDTO(productRetrieved);
        return responseProductDto;
      }
      return productRetrieved;
    } catch (error) {
      return error;
    }
  }

  async updateById(id, dataToUpdate) {
    try {
      if (dataToUpdate) {
        const db = appFirestore.firestore();
        const arrayFilteredDataProduct = Object.entries(dataToUpdate).filter(
          ([key, value]) => value !== null
        );
        const dataProductToUpdate = Object.fromEntries(arrayFilteredDataProduct);
        const isInDb = await db.collection(this.nameCollection).doc(id).get();
        if (!isInDb.exists) {
          throw new ErrorHandler({
            status: 404,
            message: "The product doesn't exist in database",
          });
        }
        const responseFromUpdate = await db
          .collection(this.nameCollection)
          .doc(id)
          .update(dataProductToUpdate);
      }
    } catch (error) {
      return error;
    }
  }

  async deleteById(id) {
    try {
      const db = appFirestore.firestore();
      const isInDb = await db.collection(this.nameCollection).doc(id).get();
      if (!isInDb.exists) {
        throw new ErrorHandler({
          status: 404,
          message: "The product or cart doesn't exist in database",
        });
      }
      const responseFromDeletion = await db.collection(this.nameCollection).doc(id).delete();
      return responseFromDeletion;
    } catch (error) {
      return error;
    }
  }
}

export { FirestoreService };
