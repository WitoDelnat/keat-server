import { FastifyInstance, LogLevel } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (fastify: FastifyInstance, _options: unknown, done: () => void) => {
    fastify.get(
      "/ready",
      { logLevel: "silent" as LogLevel },
      async (_, reply) => {
        await reply.send("ok");
      }
    );
    done();
  },
  {
    fastify: ">=3.0.0",
    name: "fastify-health",
  }
);
