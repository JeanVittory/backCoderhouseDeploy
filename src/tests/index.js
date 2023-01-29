import { app } from '../config/app.config.js';
import { applicationRoutes } from '../config/routes.config.js';
import { applicationMiddlewares } from '../config/applicationMiddlewares.config.js';
const testServer = () => {
  return new Promise((resolve, reject) => {
    applicationMiddlewares();
    applicationRoutes();
    const server = app.listen(8082, () => {
      console.log('Test server is up');
      resolve(server);
    });
    server.on('error', (error) => {
      console.log('Error starting test server.');
      reject(error);
    });
  });
};

export { testServer };
