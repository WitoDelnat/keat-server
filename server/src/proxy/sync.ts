import { FastifyInstance } from "fastify";
import { Readable } from "stream";

type Query = {
  app: string;
};

export async function sync(fastify: FastifyInstance) {
  fastify.get<{ Querystring: Query }>("/sync", (request, reply) => {
    const name = request.query.app;
    const application = fastify.applications.get(name);

    if (!application) {
      throw new Error("APPLICATION_NOT_FOUND");
    }

    const stream = new Readable();
    stream._read = () => {};

    reply
      .code(200)
      .header("Content-Type", "text/event-stream")
      .header("Connection", "keep-alive")
      .header("Cache-Control", "no-cache,no-transform")
      .send(stream);

    request.socket.addListener("close", () => {
      fastify.applications.removeEventStream(name, stream);
    });
    fastify.applications.addEventStream(name, stream);

    const payload = fastify.applications.serialize({
      data: application.exposeProxyResponse(),
    });
    stream.push(payload);
  });
}
