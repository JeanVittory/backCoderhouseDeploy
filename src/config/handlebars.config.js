import { engine } from 'express-handlebars';
import { app } from './app.config.js';

const handlebarsConfig = () => {
  app.set('views', './src/views/mainApp');
  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  return;
};

export { handlebarsConfig };
