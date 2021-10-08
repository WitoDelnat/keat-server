import { isEqual, isNumber, isString, keys, omit, toPairs } from "lodash";
import { DiscoveryCache } from "./DiscoveryCache";
import { Feature } from "./Feature";

export type Audience = boolean | number | string;

export type ClientApp = {
  name: string;
  audiences: string[];
  features: string[];
};

export type ServerApp = {
  name: string;
  features: Record<string, Audience[]>;
};

export class Application {
  public name: string;
  public server: ServerApp;
  private discoveredGroups = new DiscoveryCache();
  private discoveredFeatures = new DiscoveryCache();

  private onChange?: (app: Application) => void;

  constructor(init: {
    name: string;
    server?: ServerApp;
    onChange?: (app: Application) => void;
  }) {
    this.name = init.name;
    this.server = init.server ?? { name: init.name, features: {} };
    this.onChange = init.onChange;
  }

  getFeature(name: string): Feature | undefined {
    const server = this.server?.features[name];

    if (!server) {
      return undefined;
    }

    return new Feature({ name, server });
  }

  hasFeature(name: string): boolean {
    return this.server?.features[name] !== undefined;
  }

  registerClient(app: ClientApp) {
    if (app.name !== this.name) {
      throw new Error("INVALID_CLIENT_APP");
    }
    const groups = app.audiences.filter((a) => typeof a === "string");
    this.discoveredGroups.putAll(groups);

    const features = app.features.filter((f) => !this.hasFeature(f));
    this.discoveredFeatures.putAll(features);
  }

  registerServer(app: ServerApp) {
    if (app.name !== this.name) {
      throw new Error("INVALID_SERVER_APP");
    }
    if (isEqual(this.server, app)) {
      return;
    }
    this.server = app;
    this.onChange?.(this);
  }

  removeFeature(name: string): void {
    this.server.features = omit(this.server.features, name);
    this.onChange?.(this);
  }

  toggleFeature(name: string, audiences: Audience[]): void {
    this.discoveredFeatures.delete(name);
    this.server.features[name] = audiences;
    this.onChange?.(this);
  }

  exposeAdminResponse() {
    const features = toPairs(this.server.features).map(([name, audiences]) => {
      const enabled = audiences.filter((a) => a !== false).length !== 0;
      const progression = audiences.find(isNumber);
      const groups = audiences.filter(isString);
      return { name, audiences, enabled, progression, groups };
    });

    const audiences = this.discoveredGroups.getAll();
    const suggestedFeatures = this.discoveredFeatures.getAll();

    return {
      name: this.name,
      audiences,
      features,
      suggestedFeatures,
    };
  }

  exposeProxyResponse(): Record<string, Audience[]> {
    return this.server?.features ?? {};
  }
}
