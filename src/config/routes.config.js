import { app } from './app.config.js';
import { routerCart } from '../routes/cart.routes.js';
import { routerLogin } from '../routes/login.routes.js';
import { routerProducts } from '../routes/products.routes.js';
import { routerProfile } from '../routes/profile.routes.js';
import { routerRegister } from '../routes/register.routes.js';
import { routerCategories } from '../routes/categories.routes.js';
import { testRoute } from '../routes/test.routes.js';
import { twilioRoute } from '../routes/twilio.routes.js';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger/index.js';
import { graphqlHTTP } from 'express-graphql';
import { schema } from '../graphql/schema.graphql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const applicationRoutes = () => {
  app.use(express.static(path.join(__dirname, '../public/views')));
  app.use('/api/v1/test', express.static(path.join(__dirname, '../public/views/testData')));
  app.use('/api/v1/tech', express.static(path.join(__dirname, '../public/views/techInfo')));
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );
  app.use('/', routerLogin);
  app.use('/api/v1/register', routerRegister);
  app.use('/api/v1/profile', routerProfile);
  app.use('/api/v1/productos', routerProducts);
  app.use('/api/v1/carrito', routerCart);
  app.use('/api/v1/categories', routerCategories);
  app.use('/api/v1/test', testRoute);
  app.use('/api/v1/order', twilioRoute);
  app.use('*', (req, res) => {
    logger.warn('Error 404. Route not found');
    res.status(404).json({ message: 'Route not found' });
  });
  return;
};

export { applicationRoutes };
