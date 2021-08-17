import { EventDispatcher } from "../events/EventDispatcher";
import { Application, ClientApp, ServerApp } from "./Application";

export class ApplicationService extends EventDispatcher {
  applications: Application[] = [];

  getAll(): Application[] {
    return this.applications;
  }

  get(name: string): Application {
    const application = this.applications.find((a) => a.name === name);
    if (!application) throw new Error("APPLICATION_NOT_FOUND");
    return application;
  }

  registerClient(app: ClientApp) {
    const application = this.getOrCreate(app.name);
    application.registerClient(app);
  }

  registerServer(app: ServerApp) {
    const application = this.getOrCreate(app.name);
    application.registerServer(app);
  }

  private getOrCreate(name: string): Application {
    try {
      return this.get(name);
    } catch {
      const application = new Application({
        name,
        onChange: (app) => {
          this.dispatch(app.name, { data: app.expose() });
        },
      });
      this.applications.push(application);
      return application;
    }
  }
}
