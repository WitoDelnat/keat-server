import { ServerApp } from "../../applications/Application";
import { ApplicationService } from "../../applications/ApplicationService";
import { Synchronizer } from "../synchronizer";

export class DummySynchronizer implements Synchronizer {
  constructor(private applications: ApplicationService) {}

  async start() {
    this.applications.registerServer({
      name: "demo",
      features: {
        search: ["nobody"],
      },
    });
  }

  async stop() {
    return;
  }

  async push(app: ServerApp) {
    this.applications.registerServer(app);
  }

  async deleteApplication(name: string): Promise<void> {
    this.applications.unregisterServer(name);
  }

  async createApplication(name: string): Promise<void> {
    this.applications.registerServer({
      name,
      features: {},
    });
  }
}
