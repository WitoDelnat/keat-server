import { FastifyInstance } from "fastify";

type Query = Record<string, string>;

declare module "keat-node" {
  interface KeatNode {
    user: string | Record<string, string>;
  }
}

export async function user(fastify: FastifyInstance) {
  fastify.get<{ Querystring: Query }>("/user", (request, response) => {
    const user = request.query;
    const features = fastify.keat.getFor(user);
    response.code(200).send(features);
  });
}
