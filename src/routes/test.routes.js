import { Router } from 'express';
import {
  getProducts,
  getTechInfo,
  getRandomNumbers,
  getDataTest,
  getNgnixProcess,
} from '../controllers/test.controller.js';

const testRoute = Router();

testRoute.get('/helloworld', getDataTest);
testRoute.get('/productos-test/:quantity?', getProducts);
testRoute.get('/tech-info', getTechInfo);
testRoute.get('/randoms', getRandomNumbers);
testRoute.get('/randoms-ngnix', getNgnixProcess);

export { testRoute };
