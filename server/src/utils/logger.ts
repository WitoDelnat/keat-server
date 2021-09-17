import pino, { BaseLogger } from "pino";
import { config } from "../config";

export const logger = pino({
  level: config.logger.level,
  prettyPrint: config.logger.json
    ? undefined
    : {
        levelFirst: true,
        colorize: true,
        ignore: "pid,hostname",
      },
  formatters: {
    level: (label) => ({ level: label }),
  },
}) as BaseLogger;
