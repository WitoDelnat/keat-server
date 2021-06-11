import { FastifyInstance } from "fastify";
import { definitions } from "./handlers/definitions";

export async function routes(fastify: FastifyInstance) {
  fastify.register(definitions);
}
