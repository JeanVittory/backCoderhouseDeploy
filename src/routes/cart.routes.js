import { Router } from 'express';
import { isAuth } from '../middleware/isAuth.middleware.js';
import {
  deleteCart,
  deleteProductFromCart,
  getProductsFromCart,
  postCart,
  postProductToCart,
} from '../controllers/carts.controllers.js';

const routerCart = Router();

routerCart.post('/', isAuth, postCart);
routerCart.delete('/:id', isAuth, deleteCart);
routerCart.get('/:id/productos', isAuth, getProductsFromCart);
routerCart.post('/:id/productos', isAuth, postProductToCart);
routerCart.delete('/:id/productos/:id_prod', isAuth, deleteProductFromCart);

export { routerCart };
