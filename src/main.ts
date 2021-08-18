import { FastifyInstance } from "fastify";
import Graceful from "node-graceful";
import { config } from "./config";
import { ApplicationService } from "./modules/applications/ApplicationService";
import { KubeClient, WatchingKubernetesSynchronizer } from "./modules/backend";
import { routes } from "./routes";
import { createServer } from "./server/createServer";
import { logger } from "./utils/logger";

let server: FastifyInstance;

(async function main() {
  logger.info("Bootstrapping..");
  const applications = new ApplicationService();
  const kubeClient = KubeClient.fromConfig();
  const synchronizer = new WatchingKubernetesSynchronizer(
    kubeClient,
    applications
  );

  logger.info("Synchronizing..");
  await synchronizer.start();

  logger.info("Starting server..");
  server = createServer({ routes, applications });

  await server.listen(config.server.port, "0.0.0.0");
})();

Graceful.captureExceptions = true;
Graceful.captureRejections = false;
Graceful.on("exit", async (signal, details) => {
  logger.info({ signal, details }, "Terminating gracefully");
  await server.close();
});
