import mongoose from 'mongoose';
import { doMongoConnection } from '../../config/mongodb.config.js';
import { categoriesDTO } from '../../dto/mongo/categories.dto.js';
import { ErrorHandler } from '../../tools/errorHandler.tools.js';

let instance = null;
class CategoriesDaoMongoService {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  static getInstance(collectionName, schema) {
    if (!instance) {
      instance = new CategoriesDaoMongoService(collectionName, schema);
    }
    return instance;
  }

  async createCategory(categoryName) {
    try {
      const dbConnection = await doMongoConnection();
      const isCategory = await this.collection.findOne({ categoryName: categoryName });

      if (isCategory)
        return new ErrorHandler({
          status: 409,
          message: 'The category already exist',
        });
      const newCategory = { categoryName };
      const addDocument = new this.collection(newCategory);
      const isError = addDocument.validateSync();
      if (isError)
        return new ErrorHandler({
          status: 409,
          message: isError.message,
        });
      const categoryResponse = await addDocument.save();

      return categoriesDTO(categoryResponse);
    } catch (error) {
      return error;
    }
  }

  async getCategories() {
    try {
      const dbConnection = await doMongoConnection();
      const response = await this.collection.find();

      return categoriesDTO(response);
    } catch (error) {
      return error;
    }
  }
}

export { CategoriesDaoMongoService };
