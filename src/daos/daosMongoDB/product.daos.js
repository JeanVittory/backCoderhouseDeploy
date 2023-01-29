import mongoose from 'mongoose';
import { logger } from '../../config/logger/index.js';
import { doMongoConnection } from '../../config/mongodb.config.js';
import { productsDTO } from '../../dto/mongo/productDto.dto.js';
import { ErrorHandler } from '../../tools/errorHandler.tools.js';
import { capitalize } from '../../tools/functions.tools.js';

let instance = null;

class ProductsDaoMongoService {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema);
  }

  static getInstance(collectionName, schema) {
    if (!instance) {
      instance = new ProductsDaoMongoService(collectionName, schema);
    }
    return instance;
  }

  async save({ productName, price, thumbnail, category }) {
    try {
      const dbConnection = await doMongoConnection();
      const product = {
        productName,
        price,
        thumbnail,
        category: capitalize(category),
      };
      const addDocument = new this.collection(product);
      const error = addDocument.validateSync();
      if (error) return error;
      const productAddedResponse = await addDocument.save();

      return productAddedResponse._id;
    } catch (error) {
      return error;
    }
  }

  async getAll() {
    try {
      const dbConnection = await doMongoConnection();
      const productsRetrieved = await this.collection.find();

      const responseProductDTO = productsDTO(productsRetrieved);
      return responseProductDTO;
    } catch (error) {
      return error;
    }
  }

  async getByName(nameProduct) {
    try {
      const dbConnection = await doMongoConnection();
      const productRetrieved = await this.collection.findOne({
        productName: nameProduct,
      });

      const responseProductDTO = productsDTO(productRetrieved);
      return responseProductDTO;
    } catch (error) {
      return error;
    }
  }

  async getById(id) {
    try {
      const dbConnection = await doMongoConnection();
      if (mongoose.isObjectIdOrHexString(id)) {
        const objectId = mongoose.Types.ObjectId(id);

        const productRetrieved = await this.collection.findOne({
          _id: objectId,
        });

        if (!productRetrieved) {
          return new ErrorHandler({
            status: 404,
            message: "Product doesn't exist",
          });
        } else {
          const responseProductDTO = productsDTO(productRetrieved);
          return responseProductDTO;
        }
      } else {
        return new ErrorHandler({
          status: 400,
          message:
            'Invalid ID product, mongo only accept 12 bytes, a string of 24 hex characters or an integer id value',
        });
      }
    } catch (error) {
      return error;
    }
  }

  async getProductsByCategory(category) {
    try {
      const dbConnection = await doMongoConnection();
      const categoryCapitalized = capitalize(category);
      const response = await this.collection.find({
        category: categoryCapitalized,
      });
      if (!response.length)
        throw ErrorHandler({
          status: 404,
          message: "There isn't product in these category",
        });

      return productsDTO(response);
    } catch (error) {
      return error;
    }
  }

  async updateById(id, dataToUpdate) {
    try {
      if (dataToUpdate && mongoose.isObjectIdOrHexString(id)) {
        const dbConnection = await doMongoConnection();
        const arrayFilteredDataProduct = Object.entries(dataToUpdate).filter(
          ([key, value]) => value !== null
        );
        const dataProductToUpdate = Object.fromEntries(arrayFilteredDataProduct);
        const responseFromUpdate = await this.collection.updateOne(
          { _id: id },
          { $set: dataProductToUpdate }
        );

        if (!responseFromUpdate.matchedCount) {
          return new ErrorHandler({
            status: 404,
            message: 'Product not matched or something went wrong with the db',
          });
        }
        return responseFromUpdate;
      } else {
        return new ErrorHandler({
          status: 400,
          message:
            'Invalid ID product, mongo only accept 12 bytes, a string of 24 hex characters or an integer id value',
        });
      }
    } catch (error) {
      return error;
    }
  }

  async deleteById(idProduct) {
    try {
      if (mongoose.isObjectIdOrHexString(idProduct)) {
        const dbConnection = await doMongoConnection();
        const objectId = mongoose.Types.ObjectId(idProduct);
        const responseFromDeletion = await this.collection.findByIdAndDelete({
          _id: objectId,
        });

        if (!responseFromDeletion) {
          throw new ErrorHandler({
            status: 404,
            message: "Product doesn't exist",
          });
        }
        const responseFromProductDTO = productsDTO(responseFromDeletion);
        return responseFromProductDTO;
      } else {
        return new ErrorHandler({
          status: 400,
          message:
            'Invalid ID product, mongo only accept 12 bytes, a string of 24 hex characters or an integer id value',
        });
      }
    } catch (error) {
      return error;
    }
  }

  async deleteAll() {
    try {
      const dbConnection = await doMongoConnection();
      const responseFromDeleteAll = await this.collection.deleteMany({
        productName: { $exists: true },
      });

      return responseFromDeleteAll;
    } catch (error) {
      logger.error(error);
      return error;
    }
  }
}

export { ProductsDaoMongoService };
