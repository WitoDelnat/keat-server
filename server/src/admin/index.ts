import * as trpc from "@trpc/server";
import { z } from "zod";
import type { ApplicationService } from "../modules/applications/ApplicationService";
import type { Synchronizer } from "../modules/backend/synchronizer";
import { logger } from "../utils/logger";

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
  .mutation("createApplication", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      const app = ctx.applications.getOrCreate(input.name);
      await ctx.synchronizer.createApplication(app.server);
    },
  })
  .mutation("deleteApplication", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.synchronizer.deleteApplication(input.name);
    },
  })
  .mutation("addFeature", {
    input: z.object({
      application: z.string(),
      name: z.string(),
      audiences: z.array(z.string()),
    }),
    async resolve({ input, ctx }) {
      logger.info({ input }, "addFeature");
      const app = ctx.applications.get(input.application);
      app.addFeature(input.name, input.audiences);
      await ctx.synchronizer.updateApplication(app.server);
    },
  })
  .mutation("removeFeature", {
    input: z.object({
      application: z.string(),
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      const app = ctx.applications.get(input.application);
      app.removeFeature(input.name);
      await ctx.synchronizer.deleteFeature(app.name, input.name);
    },
  })
  .mutation("toggleFeature", {
    input: z.object({
      application: z.string(),
      name: z.string(),
      audiences: z.array(z.string().or(z.number())),
    }),
    async resolve({ input, ctx }) {
      const app = ctx.applications.get(input.application);
      app.toggleFeature(input.name, input.audiences);
      await ctx.synchronizer.updateApplication(app.server);
    },
  });
