import express from 'express';
import env from './env.config.js';

const app = express();

app.set('port', env.PORT || 8080);

export { app };
