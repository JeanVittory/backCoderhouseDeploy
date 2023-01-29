import mongoose from 'mongoose';
import { mongoConfig, mongoTestConfig, mongoDevEnv } from './databases.config.js';
import { logger } from './logger/index.js';

const uri = () => {
  if (process.env.NODE_ENV === 'production') {
    return mongoConfig.uri;
  } else if (process.env.NODE_ENV === 'development') {
    return mongoDevEnv.uri;
  } else {
    return mongoTestConfig.uri;
  }
};

const options = () => {
  if (process.env.NODE_ENV === 'production') {
    return mongoConfig.options;
  } else if (process.env.NODE_ENV === 'development') {
    return mongoDevEnv.options;
  } else {
    return mongoTestConfig.options;
  }
};

const message = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'monogo db in production mode';
  } else if (process.env.NODE_ENV === 'development') {
    return 'monogo db in development mode';
  } else {
    return 'monogo db in test mode';
  }
};
const doMongoConnection = async () => {
  try {
    await mongoose.connect(uri(), options());
    logger.info(message());
    return mongoose.connection;
  } catch (error) {
    return error;
  }
};
export { doMongoConnection };
