import { toPairs } from "lodash";
import { logger } from "../../utils/logger";
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
  public discoveredGroups = new DiscoveryCache();
  public discoveredFeatures = new DiscoveryCache();

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

    for (const name of app.features) {
      const feature = this.features.get(name);

      if (!feature) {
        this.discoveredFeatures.put(name);
      } else {
        feature.spot();
      }
    }
  }

  registerServer(app: ServerApp) {
    if (app.name !== this.name) {
      throw new Error("INVALID_SERVER_APP");
    }

    if (!this.containsUpdate(app)) {
      return;
    }

    this.features = this.createFeatures(app);
    this.onChange?.(this);
  }

  private containsUpdate(app: ServerApp) {
    const pairs = toPairs(app.features);

    if (pairs.length !== this.features.size) {
      logger.debug(
        { reason: "more or fewer features" },
        "Resource contains updates"
      );
      return true;
    }

    for (const [name, audiences] of pairs) {
      const feature = this.getFeature(name);
      if (feature?.audiences.length === audiences.length) {
        logger.debug(
          { reason: "more or fewer audiences" },
          "Resource contains updates"
        );
        return true;
      }

      for (const audience of audiences) {
        if (!feature?.audiences.some((a) => a === audience)) {
          logger.debug(
            { reason: "some audience changed value" },
            "Resource contains updates"
          );
          return true;
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

    if (!feature) {
      this.features.set(name, new Feature({ name, audiences }));
    } else {
      feature.audiences = audiences;
    }

    this.onChange?.(this);
  }

  toJson(): Record<string, Audience[]> {
    const result: Record<string, Audience[]> = {};

    for (const feature of this.features.values()) {
      result[feature.name] = feature.audiences;
    }

    return result;
  }
}
