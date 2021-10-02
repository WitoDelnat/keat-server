import { logger } from "../../../utils/logger";
import { ServerApp } from "../../applications/Application";
import { ApplicationService } from "../../applications/ApplicationService";
import { Synchronizer } from "../synchronizer";
import { KubeClient, KubeWatchStop } from "./KubeClient";

export class WatchingKubernetesSynchronizer implements Synchronizer {
  private _stopWatching?: KubeWatchStop;

  constructor(
    private client: KubeClient,
    private applications: ApplicationService
  ) {}

  async start() {
    try {
      this._stopWatching = await this.client.watchApplications({
        onAdded: (app) => this.applications.registerServer(app),
        onUpdated: (app) => this.applications.registerServer(app),
        onDeleted: (app) => this.applications.unregisterServer(app.name),
      });
    } catch (err) {
      logger.error({ err }, "failed to watch");
      throw err;
    }
  }

  async stop() {
    await this._stopWatching?.();
  }

  async createApplication(app: ServerApp) {
    await this.client.createApplication(app);
  }

  async updateApplication(app: ServerApp) {
    await this.client.patchApplication(app);
  }

  async deleteApplication(name: string) {
    await this.client.deleteApplication(name);
  }

  async deleteFeature(application: string, feature: string) {
    await this.client.deleteFeature(application, feature);
  }
}
