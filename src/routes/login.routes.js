import { Router } from 'express';
import { getLogin } from '../controllers/login.controller.js';

const routerLogin = Router();

routerLogin.get('/', getLogin);

export { routerLogin };
