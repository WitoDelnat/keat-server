import { FastifyInstance } from "fastify";
import { isArray } from "lodash";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string(),
  audiences: z.array(z.string()),
  features: z.record(
    z
      .string()
      .or(z.array(z.string()))
      .transform((a) => (isArray(a) ? a : [a]))
  ),
});

export async function register(fastify: FastifyInstance) {
  fastify.post("/register", (request, reply) => {
    const clientApp = BodySchema.parse(request.body);

    fastify.applications.registerClient(clientApp);

    reply.code(200).send("ok");
  });
}
