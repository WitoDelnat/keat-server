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

  async createApplication(app: ServerApp) {
    this.applications.registerServer(app);
  }

  async updateApplication(app: ServerApp) {
    this.applications.registerServer(app);
  }

  async deleteApplication(name: string) {
    this.applications.unregisterServer(name);
  }

  async deleteFeature(application: string, feature: string) {
    this.applications.get(application).removeFeature(feature);
  }
}
