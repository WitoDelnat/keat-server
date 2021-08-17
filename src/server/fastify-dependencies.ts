import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ApplicationService } from "../modules/applications/ApplicationService";

declare module "fastify" {
  interface FastifyInstance {
    applications: ApplicationService;
  }
}

type DependenciesOptions = {
  applications: ApplicationService;
};

export default fp(
  (
    fastify: FastifyInstance,
    options: DependenciesOptions,
    done: () => void
  ) => {
    fastify.decorate("applications", options.applications);

    done();
  },
  {
    fastify: ">=3.0.0",
    name: "fastify-dependencies",
  }
);
