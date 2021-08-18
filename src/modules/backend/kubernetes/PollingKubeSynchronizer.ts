import { Synchronizer } from "../synchronizer";
import { Signal } from "../../../utils/signal";
import { delay } from "../../../utils/delay";
import { KubeClient, KubeWatchStop } from "./KubeClient";
import { ApplicationService } from "../../applications/ApplicationService";
import { AbortController, AbortSignal } from "abort-controller";
import { logger } from "../../../utils/logger";

const DEFAULT_POLL_INTERVAL = 5000;

export class PollingKubernetesSynchronizer implements Synchronizer {
  private _task: Promise<void> = Promise.resolve();
  private _abortController: AbortController = new AbortController();
  private _signal: Signal = new Signal();

  constructor(
    private client: KubeClient,
    private applications: ApplicationService
  ) {}

  async start() {
    this._abortController.abort();
    this._abortController = new AbortController();
    this._task = this.syncInBackground(this._abortController.signal);
    return this._signal.promise;
  }

  async stop() {
    this._abortController.abort();
    return this._task;
  }

  private async syncInBackground(signal: AbortSignal): Promise<void> {
    do {
      try {
        const applications = await this.client.getApplications();

        for (const application of applications) {
          this.applications.registerServer(application);
        }

        logger.debug({ applications }, "applications synced");

        this._signal.resolve();
      } finally {
        await delay(DEFAULT_POLL_INTERVAL, signal);
      }
    } while (!signal.aborted);
  }
}
