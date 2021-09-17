import { FastifyInstance } from "fastify";
import { config } from "./config";
import { register } from "./applications";
import { sync } from "./sync";

export async function routes(fastify: FastifyInstance) {
  fastify.register(config);
  fastify.register(register);
  fastify.register(sync);
}
