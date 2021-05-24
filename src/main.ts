import { FastifyInstance } from "fastify";
import { Keat } from "keat-node";
import Graceful from "node-graceful";
import { config } from "./config";
import { routes } from "./routes";
import { createServer } from "./server/createServer";
import { logger } from "./utils/logger";

let server: FastifyInstance;
let keat: Keat;

(async function main() {
  logger.info("Bootstrapping..");

  if (config.keat) {
    keat = Keat.fromDefinitions({ definitions: config.keat, logger });
  } else {
    keat = await Keat.fromKubernetes({ logger });
    await keat.ready;
  }

  server = createServer({ routes, keat });

  await server.listen(config.server.port, "0.0.0.0");
})();

Graceful.captureExceptions = true;
Graceful.captureRejections = true;
Graceful.on("exit", async (signal, details) => {
  logger.info({ signal, details }, "Terminating gracefully");
  await server.close();
  await keat.engine.stop();
});
