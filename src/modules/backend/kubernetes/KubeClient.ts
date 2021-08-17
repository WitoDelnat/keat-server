import { readFileSync } from "fs";
import https, { Agent } from "https";
import { isArray } from "lodash";
import fetch from "node-fetch";
import * as z from "zod";
import { ServerApp } from "../../applications/Application";

const DEFAULT_ORIGIN = "https://kubernetes.default.svc";
const DEFAULT_PATH = "/var/run/secrets/kubernetes.io/serviceaccount";

type KubeInit = {
  origin?: string;
  namespace?: string;
  token: string;
  agent?: Agent;
};

export class KubeClient {
  static fromConfig(path: string = DEFAULT_PATH) {
    const namespace = readFileSync(`${path}/namespace`, "utf-8");
    const token = readFileSync(`${path}/token`, "utf-8");
    const cert = readFileSync(`${path}/ca.crt`, "utf-8");
    const agent = new https.Agent({ cert, rejectUnauthorized: false });
    return new KubeClient({ namespace, token, agent });
  }

  private origin: string;
  private agent: Agent | undefined;
  private token: string;
  private namespace: string;

  constructor({ namespace, origin, token, agent }: KubeInit) {
    this.origin = origin ?? DEFAULT_ORIGIN;
    this.namespace = namespace ?? "default";
    this.token = token;
    this.agent = agent;
  }

  async getApplications(): Promise<ServerApp[]> {
    const response = await this.fetch("keat.io", "applications", "v1alpha2");
    const applicationList = ApplicationListResource.parse(response);
    return applicationList.items.map(toApplication);
  }

  private async fetch(audience: string, plural: string, version: string) {
    const response = await fetch(
      `${this.origin}/apis/${audience}/${version}/namespaces/${this.namespace}/${plural}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        agent: this.agent,
      }
    );

    if (!response.ok) {
      throw new Error(`request failed: ${response.status}`);
    }

    const content = await response.json();
    return content;
  }
}

const ApplicationResource = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
  }),
  spec: z.record(
    z
      .string()
      .or(z.array(z.string()))
      .transform((v) => (isArray(v) ? v : [v]))
  ),
});

export const ApplicationListResource = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.any(),
  items: z.array(ApplicationResource),
});

function toApplication(resource: ApplicationResource): ServerApp {
  return {
    name: resource.metadata.name,
    features: resource.spec,
  };
}

export type ApplicationResource = z.infer<typeof ApplicationResource>;
export type ApplicationListResource = z.infer<typeof ApplicationListResource>;
