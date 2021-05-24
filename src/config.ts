import configFiles from "config";
import * as z from "zod";

const configSchema = z.object({
  server: z.object({
    port: z.number().min(0).max(65535),
  }),
  logger: z.object({
    level: z.enum([
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
      "silent",
    ]),
    json: z.boolean(),
  }),
  keat: z.any().optional(),
});

export type Config = z.infer<typeof configSchema>;
export const config = configSchema.parse(configFiles.util.toObject());
