import { FastifyInstance } from "fastify";
import { URLSearchParams } from "url";

export async function isEnabled(fastify: FastifyInstance) {
  fastify.get("/isEnabled", (request, response) => {
    const params = new URLSearchParams(request.query as string);
    const name = params.get("name");
    const user = params.get("user") ?? undefined;

    if (!name) return response.badRequest();
    if (!fastify.keat.has(name)) return response.badRequest();

    const enabled = fastify.keat.isEnabled(name, user);
    response.code(200).send(enabled);
  });
}
