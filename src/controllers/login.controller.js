import { logger } from '../config/logger/index.js';

const getLogin = (req, res) => {
  try {
    logger.info(`accessing the route: ${req.baseUrl}`);
    res.render('main', { layout: 'login' });
    return;
  } catch (error) {
    logger.error(`Error 500. ${error}`);
    return res.status(500).json(error);
  }
};

export { getLogin };
