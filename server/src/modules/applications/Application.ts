import { isNumber, isString, toPairs } from "lodash";
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
  public features = new Map<string, Feature>();
  private discoveredGroups = new DiscoveryCache();
  private discoveredFeatures = new DiscoveryCache();

  private onChange?: (app: Application) => void;

  constructor(init: {
    name: string;
    server?: ServerApp;
    onChange?: (app: Application) => void;
  }) {
    this.name = init.name;
    this.onChange = init.onChange;
  }

  getFeature(name: string): Feature | undefined {
    return this.features.get(name);
  }

  hasFeature(name: string): boolean {
    return this.features.has(name);
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
    if (this.containsUpdate(app)) {
      return;
    }

    this.features = this.createFeatures(app);
    this.onChange?.(this);
  }

  private containsUpdate(app: ServerApp) {
    const pairs = toPairs(app.features);

    if (pairs.length !== this.features.size) {
      return false; // more or fewer features
    }

    for (const [name, audiences] of pairs) {
      const feature = this.getFeature(name);
      if (feature?.audiences.length === audiences.length) {
        return true; // more or fewer audiences
      }

      for (const audience of audiences) {
        if (!feature?.audiences.some((a) => a === audience)) {
          return true; // some audience changed value
        }
      }
    }

    return false;
  }

  private createFeatures(app: ServerApp) {
    const result = new Map<string, Feature>();

    for (const [name, audiences] of toPairs(app.features)) {
      result.set(name, new Feature({ name, audiences }));
    }

    return result;
  }

  removeFeature(name: string): void {
    this.features.delete(name);
    this.onChange?.(this);
  }

  toggleFeature(name: string, audiences: Audience[]): void {
    this.discoveredFeatures.delete(name);
    const feature = this.features.get(name);
    if (!feature) return;
    feature.audiences = audiences;
    this.onChange?.(this);
  }

  exposeAdminResponse() {
    const features = [];

    for (const feature of this.features.values()) {
      const name = feature.name;
      const audiences = feature.audiences;
      const enabled = audiences.filter((a) => a !== false).length !== 0;
      const progression = audiences.find(isNumber);
      const groups = audiences.filter(isString);
      features.push({ name, audiences, enabled, progression, groups });
    }

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
    const result: Record<string, Audience[]> = {};

    for (const feature of this.features.values()) {
      result[feature.name] = feature.audiences;
    }

    return result;
  }
}
