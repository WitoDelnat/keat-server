import {
  CustomObjectsApi,
  KubeConfig,
  KubernetesObject,
  ListPromise,
  makeInformer,
} from "@kubernetes/client-node";
import { readFileSync } from "fs";
import { isArray } from "lodash";
import * as z from "zod";
import { logger } from "../../../utils/logger";
import { ServerApp } from "../../applications/Application";

const DEFAULT_PATH = "/var/run/secrets/kubernetes.io/serviceaccount";
const FIELD_MANAGER = "keat-server";

type KubeInit = {
  config: KubeConfig;
  namespace?: string;
};

export type KubeWatchListeners<T> = {
  onAdded: (value: T) => void;
  onUpdated: (value: T) => void;
  onDeleted: (value: T) => void;
};

export type KubeWatchStop = () => Promise<void>;

export class KubeClient {
  static fromConfig(path: string = DEFAULT_PATH) {
    const namespace = readFileSync(`${path}/namespace`, "utf-8");
    const config = new KubeConfig();
    config.loadFromCluster();
    return new KubeClient({ config, namespace });
  }

  private config: KubeConfig;
  private api: CustomObjectsApi;
  private namespace: string;

  constructor(init: KubeInit) {
    this.config = init.config;
    this.api = init.config.makeApiClient(CustomObjectsApi);
    this.namespace = init.namespace ?? "default";
  }

  async getApplications(): Promise<ServerApp[]> {
    const response = await this.fetch("keat.io", "v1alpha2", "applications");
    const applicationList = ApplicationListResource.parse(response);
    return applicationList.items.map(toApplication);
  }

  async patchApplication(app: ServerApp): Promise<void> {
    try {
      await this.api.replaceNamespacedCustomObject(
        "keat.io",
        "v1alpha2",
        this.namespace,
        "applications",
        app.name,
        {
          spec: app.features,
        },
        undefined,
        FIELD_MANAGER
      );
    } catch (err) {
      logger.error({ err }, "Kubernetes patch failed");
      throw err;
    }
  }

  async watchApplications(
    listeners: KubeWatchListeners<ServerApp>
  ): Promise<KubeWatchStop> {
    return await this.watch("keat.io", "v1alpha2", "applications", {
      onAdded(value) {
        const resource = ApplicationResource.parse(value);
        const serverApp = toApplication(resource);
        logger.debug({ serverApp }, "on added");
        listeners.onAdded(serverApp);
      },
      onDeleted(value) {
        const resource = ApplicationResource.parse(value);
        const serverApp = toApplication(resource);
        logger.debug({ serverApp }, "on deleted");
        listeners.onDeleted(serverApp);
      },
      onUpdated(value) {
        const resource = ApplicationResource.parse(value);
        const serverApp = toApplication(resource);
        logger.debug({ serverApp }, "on updated");
        listeners.onUpdated(serverApp);
      },
    });
  }

  private async fetch(
    group: string,
    version: string,
    plural: string
  ): Promise<object> {
    const { body, response } = await this.api.listNamespacedCustomObject(
      group,
      version,
      this.namespace,
      plural
    );

    if (response.statusCode !== 200) {
      throw new Error(`request failed with code ${response.statusCode}`);
    }

    return body;
  }

  private async watch(
    group: string,
    version: string,
    plural: string,
    listeners: KubeWatchListeners<unknown>
  ) {
    const listFn = ((() => {
      return this.api.listNamespacedCustomObject(
        group,
        version,
        this.namespace,
        plural
      );
    }) as unknown) as ListPromise<KubernetesObject>;

    const path = `/apis/${group}/${version}/namespaces/${this.namespace}/${plural}`;
    const informer = makeInformer(this.config, path, listFn);

    informer.on("add", listeners.onAdded);
    informer.on("update", listeners.onUpdated);
    informer.on("delete", listeners.onDeleted);

    informer.on("error", (err) => {
      logger.error({ err }, "informer failed");
      setTimeout(informer.start, 5000);
    });

    logger.debug("started informer");
    await informer.start();

    return informer.stop;
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
