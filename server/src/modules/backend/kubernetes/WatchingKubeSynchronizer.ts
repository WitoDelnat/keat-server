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
        onDeleted: () => {},
      });
    } catch (err) {
      logger.error({ err }, "failed to watch");
      throw err;
    }
  }

  async stop() {
    await this._stopWatching?.();
  }

  async push(app: ServerApp) {
    await this.client.replaceApplication(app);
  }

  async deleteApplication(name: string) {
    await this.client.deleteApplication(name);
  }
}
