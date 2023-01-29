import { Router } from 'express';
import { getCategories, postCategories } from '../controllers/categories.controllers.js';

const routerCategories = Router();

routerCategories.get('/', getCategories);
routerCategories.post('/', postCategories);

export { routerCategories };
