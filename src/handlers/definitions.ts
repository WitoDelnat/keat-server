import { FastifyInstance } from "fastify";

export async function definitions(fastify: FastifyInstance) {
  fastify.get("/definitions", (_, response) => {
    const definitions = fastify.keat.definitions;
    response.code(200).send(definitions);
  });
}
