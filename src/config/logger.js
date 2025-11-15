import pino from "pino";
import env from "./env.js";

const loggerConfig = {
  level: env.logLevel,
  ...(env.nodeEnv === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
};

export default loggerConfig;
