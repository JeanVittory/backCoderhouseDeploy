import { FirestoreService } from './firestore.services.js';
import { appFirestore } from '../../config/firebase/products.firebase.config.js';
import { ErrorHandler } from '../../tools/errorHandler.tools.js';
import pkg from 'firebase-admin';
const { firestore } = pkg;

let instance = null;

class CartFirebaseDaos extends FirestoreService {
  constructor(nameCollection) {
    super(nameCollection);
  }

  static getInstance(nameCollection) {
    if (!instance) {
      instance = new CartFirebaseDaos(nameCollection);
    }
    return instance;
  }

  async createCart() {
    try {
      const db = appFirestore.firestore();
      const productAddedResponse = await db.collection(this.nameCollection).add({
        date: Date.now(),
      });
      return { idCart: productAddedResponse.id };
    } catch (error) {
      return error;
    }
  }
  async saveProductOnCart(idCart, newProduct) {
    try {
      const db = appFirestore.firestore();
      const isInDb = await db.collection(this.nameCollection).doc(idCart).get();
      if (!isInDb.exists) {
        throw new ErrorHandler({
          status: 404,
          message: "The cart don't exist in the database",
        });
      }
      await db
        .collection(this.nameCollection)
        .doc(idCart)
        .update({
          products: firestore.FieldValue.arrayUnion(newProduct),
        });
      return { message: 'Product added' };
    } catch (error) {
      return error;
    }
  }

  async deleteProductFromCart(idCart, idProduct) {
    try {
      const db = appFirestore.firestore();
      const productsInCart = (await db.collection(this.nameCollection).doc(idCart).get()).data();
      const dataToArray = new Array(productsInCart.products).flat();
      if (!dataToArray.length) {
        throw new ErrorHandler({
          status: 404,
          message: 'The cart is empty',
        });
      }
      const isProduct = dataToArray.some((product) => product.id === idProduct);
      if (!isProduct) {
        throw new ErrorHandler({
          status: 404,
          message: "The product doesn't exist in your cart",
        });
      }
      const newDataUpdated = dataToArray.filter((doc) => doc.id !== idProduct);
      await db.collection(this.nameCollection).doc(idCart).update({ products: newDataUpdated });
      return { message: 'product deleted' };
    } catch (error) {
      return error;
    }
  }
}

export { CartFirebaseDaos };
