import { isEqual, omit, toPairs } from "lodash";
import { Feature } from "./Feature";
import type { Application as AdminApplication } from "../../admin/index";

export type ClientApp = {
  name: string;
  audiences: string[];
  features: Record<string, (number | string)[]>;
};

export type ServerApp = {
  name: string;
  features: Record<string, (number | string)[]>;
};

export class Application {
  public name: string;
  public server: ServerApp;
  public client: ClientApp | undefined;
  private onChange?: (app: Application) => void;

  constructor(init: {
    name: string;
    server?: ServerApp;
    client?: ClientApp;
    onChange?: (app: Application) => void;
  }) {
    this.name = init.name;
    this.client = init.client;
    this.server = init.server ?? { name: init.name, features: {} };
    this.onChange = init.onChange;
  }

  availableAudiences(): string[] {
    return this.client?.audiences ?? [];
  }

  getFeature(name: string): Feature | undefined {
    const client = this.client?.features[name];
    const server = this.server?.features[name];

    if (!client && !server) {
      return undefined;
    }

    return new Feature({ name, client, server });
  }

  registerClient(app: ClientApp) {
    if (app.name !== this.name) {
      throw new Error("INVALID_CLIENT_APP");
    }
    this.client = app;
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

  addFeature(name: string, audiences: (number | string)[]): void {
    this.toggleFeature(name, audiences);
  }

  removeFeature(name: string): void {
    this.server.features = omit(this.server.features, name);
    this.onChange?.(this);
  }

  toggleFeature(name: string, audiences: (number | string)[]): void {
    this.server.features[name] = audiences;
    this.onChange?.(this);
  }

  exposeAdminResponse(): AdminApplication {
    const features: Feature[] = toPairs({
      ...this.server.features,
      ...this.client?.features,
    }).map(([name]) => {
      const client = this.client?.features[name] ?? [];
      const server = this.server.features[name] ?? [];
      const audiences = server.length > 0 ? server : client;
      const p = audiences.find((a) => typeof a === "number");
      const progression = typeof p === "number" ? p : undefined;
      return { name, audiences, server, client, progression };
    });

    return {
      name: this.name,
      audiences: this.availableAudiences(),
      features,
    };
  }

  exposeProxyResponse(): Record<string, (number | string)[]> {
    return this.server?.features ?? {};
  }
}
