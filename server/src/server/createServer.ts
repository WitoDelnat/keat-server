import Fastify, { FastifyPluginAsync } from "fastify";
import fastifyCors from "fastify-cors";
import fastifySensible from "fastify-sensible";
import fastifyStatic from "fastify-static";
import path from "path";
import { AppRouter, Context } from "../admin";
import { ApplicationService } from "../modules/applications/ApplicationService";
import { Synchronizer } from "../modules/backend/synchronizer";
import { logger } from "../utils/logger";
import fastifyDependencies from "./fastify-dependencies";
import fastifyHealth from "./fastify-health";
import fastifyTrpc from "./fastify-trpc";

type ServerInit = {
  adminRouter: AppRouter;
  routes: FastifyPluginAsync;
  applications: ApplicationService;
  synchronizer: Synchronizer;
};

export function createServer({
  routes,
  adminRouter,
  applications,
  synchronizer,
}: ServerInit) {
  const server = Fastify({ logger });

  server.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: "*",
  });
  server.register(fastifySensible, { errorHandler: false });
  server.register(fastifyHealth);
  server.register(fastifyDependencies, { applications });

  server.register(routes, { prefix: "api" });

  server.register(fastifyTrpc, {
    prefix: "admin",
    router: adminRouter,
    createContext: (): Context => {
      return {
        applications,
        synchronizer,
      };
    },
  });
  server.register(fastifyStatic, {
    root: path.join(__dirname, "../../public"),
    wildcard: false,
  });
  server.setNotFoundHandler((_request, reply) => {
    return reply.sendFile("index.html");
  });

  return server;
}
