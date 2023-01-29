import { createLogger, transports, format } from 'winston';
import * as url from 'url';

const { combine, timestamp, printf } = format;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const loggerConfig = () => {
  const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message} `;
  });

  return createLogger({
    format: combine(timestamp({ format: 'DD-MM-YYYY T hh:mm:ss' }), customFormat),
    transports: [
      new transports.Console({
        level: 'info',
      }),
      new transports.File({
        level: 'warn',
        filename: `${__dirname}/../logs/warn.log`,
      }),
      new transports.File({
        level: 'error',
        filename: `${__dirname}/../logs/error.log`,
      }),
    ],
  });
};

export { loggerConfig };
