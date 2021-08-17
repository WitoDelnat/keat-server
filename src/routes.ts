import { FastifyInstance } from "fastify";
import { config } from "./proxy/config";
import { register } from "./proxy/register";
import { sync } from "./proxy/sync";

export async function routes(fastify: FastifyInstance) {
  fastify.register(config);
  fastify.register(register);
  fastify.register(sync);
}
