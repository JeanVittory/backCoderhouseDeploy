import { CartService } from '../services/cart.services.js';
import { ProductService } from '../services/product.services.js';
import { logger } from '../config/logger/index.js';

const postCart = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const responseFromCreateCart = await CartService.createCart();
    if (responseFromCreateCart instanceof Error) throw Error('Something went wrong in server');
    return res.status(201).json(responseFromCreateCart);
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id } = req.params;
    const responseFromDeleteCart = await CartService.deleteById(id);
    if (responseFromDeleteCart?.status) {
      logger.error(`${responseFromDeleteCart.status}. ${responseFromDeleteCart.message}`);
      return res.status(responseFromDeleteCart.status).json({
        status: responseFromDeleteCart.status,
        message: responseFromDeleteCart.message,
      });
    }
    res.status(202).json({ message: 'Cart deleted' });
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getProductsFromCart = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id } = req.params;
    const responseFromGetProductsFromCart = await CartService.getById(id);
    if (responseFromGetProductsFromCart?.status) {
      logger.error(
        `${responseFromGetProductsFromCart.status}. ${responseFromGetProductsFromCart.message}`
      );
      return res.status(responseFromGetProductsFromCart.status).json({
        status: responseFromGetProductsFromCart.status,
        message: responseFromGetProductsFromCart.message,
      });
    }
    return res.status(200).json(responseFromGetProductsFromCart);
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const postProductToCart = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id: idCart } = req.params;
    const { id: idProduct } = req.body;
    const productFromDatabaseProducts = await ProductService.getById(idProduct);
    if (productFromDatabaseProducts.status) {
      logger.error(`${productFromDatabaseProducts.status}.${productFromDatabaseProducts.message}`);
      return res.status(productFromDatabaseProducts.status).json({
        status: productFromDatabaseProducts.status,
        message: productFromDatabaseProducts.message,
      });
    }
    const responseFromPostProductsOnCart = await CartService.saveProductOnCart(
      idCart,
      productFromDatabaseProducts
    );
    if (responseFromPostProductsOnCart?.status) {
      logger.error(
        `${responseFromPostProductsOnCart.status}.${responseFromPostProductsOnCart.message}`
      );
      return res.status(responseFromPostProductsOnCart.status).json({
        status: responseFromPostProductsOnCart.status,
        message: responseFromPostProductsOnCart.message,
      });
    }
    return res.status(201).json(responseFromPostProductsOnCart);
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    const { id, id_prod } = req.params;
    const isProductInDb = await ProductService.getById(id_prod);
    if (isProductInDb?.status) {
      logger.error(`${isProductInDb.status}.${isProductInDb.message}`);
      return res.status(isProductInDb.status).json({
        status: isProductInDb.status,
        message: isProductInDb.message,
      });
    }
    const isCartInDb = await CartService.getById(id);
    if (isCartInDb?.status) {
      logger.error(`${isCartInDb.status}.${isCartInDb.message}`);
      return res.status(isCartInDb.status).json({
        status: isCartInDb.status,
        message: isCartInDb.message,
      });
    }
    const resposeFromDeleteProductFromCart = await CartService.deleteProductFromCart(id, id_prod);
    if (resposeFromDeleteProductFromCart?.status) {
      logger.error(
        `${resposeFromDeleteProductFromCart.status}.${resposeFromDeleteProductFromCart.message}`
      );
      return res.status(resposeFromDeleteProductFromCart.status).json({
        status: resposeFromDeleteProductFromCart.status,
        message: resposeFromDeleteProductFromCart.message,
      });
    }
    res.status(200).json(resposeFromDeleteProductFromCart);
  } catch (error) {
    logger.error(`Error 500. ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export { postCart, deleteCart, getProductsFromCart, postProductToCart, deleteProductFromCart };
