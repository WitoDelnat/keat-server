import * as trpc from "@trpc/server";
import { z } from "zod";
import type { ApplicationService } from "../modules/applications/ApplicationService";
import type { Synchronizer } from "../modules/backend/synchronizer";

export type AppRouter = typeof appRouter;

export type Feature = {
  name: string;
  audiences: (number | string)[];
  progression?: number;
  client?: (number | string)[];
  server?: (number | string)[];
};

export type Application = {
  name: string;
  audiences: string[];
  features: Feature[];
};

export type Context = {
  applications: ApplicationService;
  synchronizer: Synchronizer;
};

export const appRouter = trpc
  .router<Context>()
  .query("applications", {
    async resolve({ ctx }): Promise<Application[]> {
      const applications = ctx.applications.getAll();
      return applications.map((a) => a.exposeAdminResponse());
    },
  })
  .mutation("toggle", {
    input: z.object({
      application: z.string(),
      feature: z.string(),
      audiences: z.array(z.number().or(z.string())),
    }),
    async resolve({ input, ctx }) {
      const { application, feature, audiences } = input;
      const app = ctx.applications.get(application);
      app.toggleFeature(feature, audiences);

      await ctx.synchronizer.push(app.server);
    },
  });
