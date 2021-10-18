import * as trpc from "@trpc/server";
import { flatten, isNumber, isString } from "lodash";
import { z } from "zod";
import type {
  Application as IApplication,
  Audience,
} from "../modules/applications/Application";
import type { ApplicationService } from "../modules/applications/ApplicationService";
import type { Synchronizer } from "../modules/backend/synchronizer";

export type AppRouter = typeof appRouter;

export type Application = {
  name: string;
  suggestedFeatures: string[];
  suggestedAudiences: string[];
  features: Feature[];
};

export type Feature = {
  name: string;
  audiences: Audience[];
  enabled: boolean;
  progression: number | undefined;
  groups: string[] | undefined;
  lastSeen: number | undefined;
};

export type Context = {
  applications: ApplicationService;
  synchronizer: Synchronizer;
};

const AudienceSchema = z.boolean().or(z.string()).or(z.number());

export const appRouter = trpc
  .router<Context>()
  .query("indexPage", {
    async resolve({ ctx }) {
      const applications = ctx.applications.getAll();
      return applications.map((a) => {
        return { name: a.name, featureCount: a.features.size };
      });
    },
  })
  .query("getApplicationNames", {
    async resolve({ ctx }) {
      const applications = ctx.applications.getAll();
      return applications.map((a) => a.name);
    },
  })
  .query("application", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }): Promise<Application> {
      const application = ctx.applications.get(input.name);
      return exposeApplication(application);
    },
  })
  .mutation("createApplication", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      const app = ctx.applications.getOrCreate(input.name);

      await ctx.synchronizer.createApplication({
        name: app.name,
        features: app.toJson(),
      });
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
      audiences: AudienceSchema.array(),
    }),
    async resolve({ input, ctx }) {
      const app = ctx.applications.get(input.application);
      app.toggleFeature(input.name, input.audiences);
      await ctx.synchronizer.updateApplication({
        name: app.name,
        features: app.toJson(),
      });
    },
  });

function exposeApplication(application: IApplication): Application {
  const features = [];

  for (const feature of application.features.values()) {
    const feat = {
      name: feature.name,
      application: application.name,
      lastSeen: feature.lastSeen?.getTime(),
      audiences: feature.audiences,
      enabled: feature.audiences.filter((a) => a !== false).length !== 0,
      progression: feature.audiences.find(isNumber),
      groups: feature.audiences.filter(isString),
    };

    features.push(feat);
  }

  return {
    name: application.name,
    suggestedFeatures: application.discoveredFeatures.getAll(),
    suggestedAudiences: application.discoveredGroups.getAll(),
    features,
  };
}
