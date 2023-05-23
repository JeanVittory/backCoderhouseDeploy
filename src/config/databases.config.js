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
	uri: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.k5yynll.mongodb.net/${env.DATABASE_MONGO}`,
	options: {
		useNewUrlParser: false,
		useUnifiedTopology: false,
	},
};

const mongoTestConfig = {
	uri: `mongodb+srv://${env.USER_MONGO}:${env.PASSWORD_MONGO}@cluster0.k5yynll.mongodb.net/${env.TEST_DATABASE_MONGO}`,
	options: {
		useNewUrlParser: false,
		useUnifiedTopology: false,
	},
};

const mongoDevEnv = {
	uri: env.TEST_DATABASE_MONGO,
	options: {
		useNewUrlParser: false,
		useUnifiedTopology: false,
	},
};

export { chatDbOpt, databaseOpt, mongoConfig, mongoTestConfig, mongoDevEnv };
