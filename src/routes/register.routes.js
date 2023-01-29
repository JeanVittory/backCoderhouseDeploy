import { Router } from 'express';
import { getRegister, postRegister } from '../controllers/register.controllers.js';
import { multerMiddleware } from '../tools/multerAvatars.tools.js';

const routerRegister = Router();

routerRegister.get('/', getRegister);
routerRegister.post('/', multerMiddleware, postRegister);

export { routerRegister };
