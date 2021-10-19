import { ApplicationService } from "../applications/ApplicationService";
import { DummySynchronizer } from "./dummy/DummySynchronizer";
import { KubeClient } from "./kubernetes/KubeClient";
import { WatchingKubernetesSynchronizer } from "./kubernetes/WatchingKubeSynchronizer";
import { Synchronizer } from "./synchronizer";

export { KubeClient } from "./kubernetes/KubeClient";
export { WatchingKubernetesSynchronizer } from "./kubernetes/WatchingKubeSynchronizer";

export function createSynchronizer(
  type: "in-memory" | "kubernetes" | "kubernetes-polling",
  applications: ApplicationService
): Synchronizer {
  switch (type) {
    case "in-memory": {
      return new DummySynchronizer(applications);
    }
    case "kubernetes": {
      const kubeClient = KubeClient.fromConfig();
      return new WatchingKubernetesSynchronizer(kubeClient, applications);
    }
    default:
      throw new Error("SYNCHRONIZER_MISCONFIGURED");
  }
}
