import type { ServerApp } from "../applications/Application";

export interface Synchronizer {
  start(): Promise<void>;
  push(app: ServerApp): Promise<void>;
}
