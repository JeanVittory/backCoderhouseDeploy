import { FirestoreService } from './firestore.services.js';

let instance = null;

class ProductsFirebaseDaos extends FirestoreService {
  constructor(nameCollection) {
    super(nameCollection);
  }

  static getInstance(nameCollection) {
    if (!instance) {
      instance = new ProductsFirebaseDaos(nameCollection);
    }
    return instance;
  }
}

export { ProductsFirebaseDaos };
