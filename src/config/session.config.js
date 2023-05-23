import session from 'express-session';
import env from './env.config.js';
import mongoStore from 'connect-mongo';

const sessionConfig = session({
	secret: env.SECRET_SESSION,
	store: mongoStore.create({
		mongoUrl: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.k5yynll.mongodb.net/${env.DATABASE_SESSIONS_MONGO}`,
		mongoOptions: {
			useNewUrlParser: false,
			useUnifiedTopology: false,
		},
	}),
	resave: false,
	saveUninitialized: false,
	cookie: {},
});

export { sessionConfig };
