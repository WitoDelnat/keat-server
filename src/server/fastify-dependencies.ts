import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Keat } from "keat-node";

declare module "fastify" {
  interface FastifyInstance {
    keat: Keat;
  }
}

type DependenciesOptions = {
  keat: Keat;
};

export default fp(
  (
    fastify: FastifyInstance,
    options: DependenciesOptions,
    done: () => void
  ) => {
    fastify.decorate("keat", options.keat);

    done();
  },
  {
    fastify: ">=3.0.0",
    name: "fastify-dependencies",
  }
);
