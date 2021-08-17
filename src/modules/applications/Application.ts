import { isEqual } from "lodash";
import { Feature } from "./Feature";

export type ClientApp = {
  name: string;
  audiences: string[];
  features: Record<string, string[]>;
};

export type ServerApp = {
  name: string;
  features: Record<string, string[]>;
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

  toggleFeature(name: string, audiences: string[]): void {
    this.server.features[name] = audiences;
    this.onChange?.(this);
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
    if (isEqual(this.server, app)) return;
    this.server = app;
    this.onChange?.(this);
  }

  expose(): Record<string, string[]> {
    return this.server?.features ?? {};
  }
}
