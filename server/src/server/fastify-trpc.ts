import { AnyRouter, resolveHTTPResponse } from "@trpc/server";
import { HTTPRequest } from "@trpc/server/dist/declarations/src/http/internals/types";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { URLSearchParams } from "url";

type TrpcOptions = {
  prefix: string;
  router: AnyRouter;
  createContext: () => any;
};

export default fp(
  (fastify: FastifyInstance, options: TrpcOptions, done: () => void) => {
    const { prefix, router, createContext } = options;
    const path = prefix ? `/${prefix}/trpc/:path` : "/trpc/:path";

    fastify.all(path, async (req, reply) => {
      const path = (req.params as any).path;
      const request: HTTPRequest = {
        method: req.method,
        query: new URLSearchParams(req.query as any),
        headers: req.headers,
        body: req.body,
      };

      const response = await resolveHTTPResponse({
        req: request,
        router,
        createContext,
        path,
      });

      if (response.headers) {
        reply.headers(response.headers);
      }

      return reply.status(response.status).send(response.body);
    });

    done();
  },
  {
    fastify: ">=3.0.0",
    name: "fastify-trpc",
  }
);
