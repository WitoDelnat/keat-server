import { FastifyInstance } from "fastify";
import { definitions } from "./handlers/definitions";
import { isEnabled } from "./handlers/isEnabled";

export async function routes(fastify: FastifyInstance) {
  fastify.register(definitions);
  fastify.register(isEnabled);
}
