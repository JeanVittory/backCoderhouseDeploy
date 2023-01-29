import { ProductService } from '../services/product.services.js';
import { logger } from '../config/logger/index.js';
import { getRedis, setRedis } from '../config/redis/init.redis.js';

const getProducts = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id } = req.params;
    if (!id) {
      const productsCached = await getRedis('products');
      if (!productsCached) {
        const responseFromGetAll = await ProductService.getAll();
        if (responseFromGetAll instanceof Error) {
          throw new Error('Something went Wrong with server');
        }
        await setRedis('products', responseFromGetAll);
        return res.status(200).json(responseFromGetAll);
      } else {
        return res.status(200).json(productsCached);
      }
    } else {
      const productCached = await getRedis(id);
      if (!productCached) {
        const responseFromGetByIdController = await ProductService.getById(id);
        if (responseFromGetByIdController?.message) {
          return res.status(responseFromGetByIdController.status).json({
            status: responseFromGetByIdController.status,
            message: responseFromGetByIdController.message,
          });
        } else {
          await setRedis(id, responseFromGetByIdController);
          return res.status(200).json(responseFromGetByIdController);
        }
      } else {
        return res.status(200).json(productCached);
      }
    }
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const postProducts = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    if (!req.file) {
      logger.error('Error 400. Enter a product image');
      return res.status(400).json({ error: 'Enter a product image' });
    }
    if (!req.body.productName || !req.body.price || !req.body.category) {
      logger.error('You must enter the name of the product, its respective price and a category');
      return res.status(400).json({
        error: 'You must enter the name of the product, its respective price and a category',
      });
    }
    const newProduct = {
      ...req.body,
      price: req.body.price,
      thumbnail: req.file.originalname,
      category: req.body.category,
    };
    const responseFromSaveController = await ProductService.save(newProduct);

    if (responseFromSaveController?.message) {
      logger.error(`${responseFromSaveController.status}. ${responseFromSaveController.message}`);
      res.status(404).json({ error: responseFromSaveController.message });
    } else {
      res.status(201).json(responseFromSaveController);
    }
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
  }
};

const putProductsById = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id } = req.params;
    const { productName, price } = req.body;

    if (!productName && !price && !req.file) {
      logger.error('Error 400. Por favor ingresa un valor a ser actualizado');
      return res.status(400).json({ error: 'Please enter a value to be updated' });
    }
    const product = {
      productName: productName || null,
      price: price || null,
      thumbnail: req.file?.originalname ?? null,
    };
    const responseFromUpdatecontroller = await ProductService.updateById(id, product);
    if (responseFromUpdatecontroller?.message) {
      logger.error(
        `${responseFromUpdatecontroller.status}. ${responseFromUpdatecontroller.message}`
      );
      res
        .status(responseFromUpdatecontroller.status)
        .json({ error: responseFromUpdatecontroller.message });
    } else {
      res.status(200).json(responseFromUpdatecontroller);
    }
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const deleteProductsById = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id } = req.params;
    const responseFromDeleteController = await ProductService.deleteById(id);
    if (responseFromDeleteController?.message) {
      logger.error(
        `${responseFromDeleteController.status}. ${responseFromDeleteController.message}`
      );
      res.status(404).json({ error: responseFromDeleteController.message });
    } else {
      res.status(200).json(responseFromDeleteController.id);
    }
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const response = await ProductService.getProductsByCategory(category);
    if (response instanceof Array && response.length > 0) res.status(200).json(response);
    if (Object.keys(response).length === 0)
      res.status(404).json({ message: 'Not products available' });
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export { getProducts, postProducts, putProductsById, deleteProductsById, getProductsByCategory };
