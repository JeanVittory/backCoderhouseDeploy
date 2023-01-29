import { fork } from 'child_process';
import { generateProducts } from '../tools/productsByFaker.tools.js';
import { app } from '../config/app.config.js';

const getProducts = (req, res) => {
  try {
    const { quantity } = req.params;
    const quantityValidation = quantity === undefined ? 5 : +quantity;
    let products = [];
    for (let quantityIterated = 0; quantityIterated < quantityValidation; ++quantityIterated) {
      let objProduct = generateProducts();
      products.push(objProduct);
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong faking data' });
  }
};

const getTechInfo = (req, res) => {
  return res.status(200).json({
    entranceArguments: null,
    exec: process.execPath,
    platform: process.platform,
    processId: process.pid,
    nodeVersion: process.version,
    directory: process.cwd(),
    memoryUsage: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
    cpuCore: 'hello2',
  });
};

const getRandomNumbers = (req, res) => {
  const { quantity } = req.query;
  const maxNumbers = +quantity || 20000;
  if (maxNumbers) {
    const forkProcess = fork('./src/tools/functions.tools.js');
    forkProcess.send({ action: 'go', value: maxNumbers });
    forkProcess.on('message', (data) => {
      return res.json({ data });
    });
  }
};

const getNgnixProcess = (req, res) => {
  return res.send(
    `servidor en ngnix levantado en el puerto ${app.get('port')} con el worker ${process.pid}`
  );
};

const getDataTest = (req, res) => {
  return res.json('helloworld');
};

export { getProducts, getTechInfo, getRandomNumbers, getDataTest, getNgnixProcess };
