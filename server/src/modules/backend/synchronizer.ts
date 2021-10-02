import type { ServerApp } from "../applications/Application";

export interface Synchronizer {
  start(): Promise<void>;

  createApplication(app: ServerApp): Promise<void>;
  updateApplication(app: ServerApp): Promise<void>;
  deleteApplication(name: string): Promise<void>;

  deleteFeature(application: string, feature: string): Promise<void>;
}
