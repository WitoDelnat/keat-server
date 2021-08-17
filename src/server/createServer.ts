import Fastify, { FastifyPluginAsync } from "fastify";
import fastifyCors from "fastify-cors";
import fastifySensible from "fastify-sensible";
import { ApplicationService } from "../modules/applications/ApplicationService";
import fastifyDependencies from "./fastify-dependencies";
import fastifyHealth from "./fastify-health";

type ServerInit = {
  routes: FastifyPluginAsync;
  applications: ApplicationService;
};

export function createServer({ routes, applications }: ServerInit) {
  const server = Fastify();

  server.register(fastifyCors);
  server.register(fastifySensible, { errorHandler: false });
  server.register(fastifyHealth);
  server.register(fastifyDependencies, { applications });
  server.register(routes);

  return server;
}
