import { app } from './config/app.config.js';
import { serverHttp } from './config/socketio.config.js';
import { args } from './config/yargs.config.js';
import { applicationRoutes } from './config/routes.config.js';
import { handlebarsConfig } from './config/handlebars.config.js';
import { applicationMiddlewares } from './config/applicationMiddlewares.config.js';
import sticky from 'sticky-session';
import cluster from 'cluster';
import { cpus } from 'os';
import { testRoute } from './routes/test.routes.js';
import { logger } from './config/logger/index.js';

if (args.mode === 'cluster') {
  if (!sticky.listen(serverHttp, app.get('port'))) {
    serverHttp.once('listening', () => {
      logger.info(`Server running on port ${app.get('port')} in mode cluster`);
    });
  } else {
    applicationMiddlewares();
    applicationRoutes();
    handlebarsConfig();
  }
}

if (args.mode === 'fork') {
  applicationMiddlewares();

  applicationRoutes();
  handlebarsConfig();
  serverHttp.listen(app.get('port'), () => {
    logger.info(`Server running on port ${app.get('port')} in mode fork`);
  });
  serverHttp.on('error', (e) => logger.warn(e));
}

if (args.mode === 'native_cluster') {
  const cpuCores = cpus().length;
  if (cluster.isPrimary) {
    for (let core = 0; core < cpuCores; core++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      logger.info(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app.use('/api', testRoute);
    app.listen(app.get('port'), () => {
      logger.info(`server running on port ${app.get('port')} with work ${process.pid}`);
    });
  }
}
