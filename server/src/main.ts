import { FastifyInstance } from "fastify";
import Graceful from "node-graceful";
import { appRouter } from "./admin";
import { config } from "./config";
import { ApplicationService } from "./modules/applications/ApplicationService";
import { createSynchronizer } from "./modules/backend";
import { DummySynchronizer } from "./modules/backend/dummy/DummySynchronizer";
import { routes } from "./proxy/routes";
import { createServer } from "./server/createServer";
import { logger } from "./utils/logger";

let server: FastifyInstance;

(async function main() {
  logger.info("Bootstrapping..");
  const applications = new ApplicationService();
  const synchronizer = createSynchronizer("in-memory", applications);

  logger.info("Synchronizing..");
  await synchronizer.start();

  logger.info("Starting server..");
  server = createServer({
    routes,
    applications,
    synchronizer,
    adminRouter: appRouter,
  });

  await server.listen(config.server.port, "0.0.0.0");
})();

Graceful.captureExceptions = true;
Graceful.captureRejections = false;
Graceful.on("exit", async (signal, details) => {
  logger.info({ signal, details }, "Terminating gracefully");
  await server.close();
});
