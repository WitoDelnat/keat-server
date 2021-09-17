import { FastifyInstance } from "fastify";

type Query = {
  app: string;
};

export async function config(fastify: FastifyInstance) {
  fastify.get<{ Querystring: Query }>("/config", (request, reply) => {
    const name = request.query.app;
    const application = fastify.applications.get(name);
    reply.code(200).send(application.exposeProxyResponse());
  });
}
