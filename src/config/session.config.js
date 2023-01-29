import session from 'express-session';
import env from './env.config.js';
import mongoStore from 'connect-mongo';

const sessionConfig = session({
  secret: env.SECRET_SESSION,
  store: mongoStore.create({
    mongoUrl: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.iz84azo.mongodb.net/${env.DATABASE_SESSIONS_MONGO}?retryWrites=true&w=majority`,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {},
});

export { sessionConfig };
