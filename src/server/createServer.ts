import Fastify, { FastifyPluginAsync } from "fastify";
import fastifyCors from "fastify-cors";
import fastifySensible from "fastify-sensible";
import { Keat } from "keat-node";
import { logger } from "../utils/logger";
import fastifyDependencies from "./fastify-dependencies";
import fastifyHealth from "./fastify-health";

type ServerInit = {
  routes: FastifyPluginAsync;
  keat: Keat;
};

export function createServer({ routes, keat }: ServerInit) {
  const server = Fastify({ logger });

  server.register(fastifyCors);
  server.register(fastifySensible, { errorHandler: false });
  server.register(fastifyHealth);
  server.register(fastifyDependencies, { keat });
  server.register(routes, { prefix: "v1" });

  return server;
}
