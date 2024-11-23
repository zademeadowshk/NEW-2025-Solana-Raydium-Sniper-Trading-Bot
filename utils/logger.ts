import winston from 'winston';

export const setUpLogger = () => {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
      }),
    ],
  });
};
