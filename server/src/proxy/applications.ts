import { FastifyInstance } from "fastify";
import { z } from "zod";

const BodySchema = z.object({
  name: z.string(),
  audiences: z.array(z.string()),
  features: z.array(z.string()),
});

export async function register(fastify: FastifyInstance) {
  fastify.get("/applications", (_, reply) => {
    const apps = fastify.applications
      .getAll()
      .map((a) => a.client)
      .filter((a) => a !== undefined);

    reply.code(200).send(apps);
  });

  fastify.post("/applications", (request, reply) => {
    const clientApp = BodySchema.parse(JSON.parse(request.body as string));

    fastify.applications.registerClient(clientApp);

    reply.code(200).send();
  });

  fastify.get("/test", (_, reply) => {
    fastify.applications.registerClient({
      name: "demo",
      audiences: ["staff", "stakeholders"],
      features: ["search", "chatbot"],
    });

    reply.code(200).send();
  });
}
