import { Router } from 'express';
import { multerMiddleware } from '../tools/multer.tools.js';
import { isAuthUser, isAuth, isAuthAdmin } from '../middleware/isAuth.middleware.js';
import {
  getProducts,
  postProducts,
  putProductsById,
  deleteProductsById,
  getProductsByCategory,
} from '../controllers/products.controllers.js';
const routerProducts = Router();

routerProducts.get('/:id?', isAuth, getProducts);
routerProducts.get('/categorias/:category', isAuth, getProductsByCategory);
routerProducts.post('/', isAuthAdmin, multerMiddleware, postProducts);
routerProducts.put('/:id', isAuthAdmin, multerMiddleware, putProductsById);
routerProducts.delete('/:id', isAuthAdmin, deleteProductsById);

export { routerProducts };
