import env from './env.config.js';

const chatDbOpt = {
  client: 'sqlite3',
  connection: {
    filename: './src/databases/ecommerce.sqlite',
  },
  useNullAsDefault: true,
};

const databaseOpt = {
  client: 'mysql2',
  connection: {
    host: env.HOST_SQL,
    port: env.PORT_SQL,
    user: env.USER_SQL,
    password: env.PASSWORD_SQL,
    database: env.DATABASE_SQL,
  },
};

const mongoConfig = {
  uri: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.iz84azo.mongodb.net/${env.DATABASE_MONGO}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoTestConfig = {
  uri: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.iz84azo.mongodb.net/${env.TEST_DATABASE_MONGO}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDevEnv = {
  uri: `mongodb://localhost:${env.PORT_MONGO_DEV}/coderhouse`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export { chatDbOpt, databaseOpt, mongoConfig, mongoTestConfig, mongoDevEnv };
