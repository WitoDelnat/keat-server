import { FastifyInstance } from "fastify";
import { fromPairs } from "lodash";

type Query = {
  labelSelector?: string;
};

export async function definitions(fastify: FastifyInstance) {
  fastify.get<{ Querystring: Query }>("/definitions", (request, response) => {
    const labels = decodeLabelSelectors(request.query.labelSelector);

    if (!labels) {
      response.code(200).send(fastify.keat.definitions);
    } else {
      const audiences = fastify.keat.definitions.audiences;
      const features = fastify.keat.engine
        .features()
        .filter((feature) => feature.match(labels))
        .map((feature) => feature.toDefinition());

      response.code(200).send({ audiences, features });
    }
  });
}

export function decodeLabelSelectors(
  selector: string | undefined
): Record<string, string> | undefined {
  if (!selector) return undefined;

  const pairs = selector
    .split(",")
    .map((encodedSelector) => decodeURIComponent(encodedSelector))
    .map((selector) => selector.split("="));
  return fromPairs(pairs);
}
