import { FastifyInstance } from "fastify";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string(),
  audiences: z.array(z.string()),
  features: z.array(z.string()),
});

export async function register(fastify: FastifyInstance) {
  fastify.post("/applications", (request, reply) => {
    const clientApp = BodySchema.parse(JSON.parse(request.body as string));

    try {
      fastify.applications.registerClient(clientApp);
      reply.code(200).send();
    } catch {
      reply.code(404).send("APPLICATION_NOT_FOUND");
    }
  });
}
