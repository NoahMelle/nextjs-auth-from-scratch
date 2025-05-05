import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

const isCI = process.env.CI === "true";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["production", "development", "test"]).optional(),
    DATABASE_URL: isCI
      ? z
          .string()
          .url()
          .optional()
          .default("mysql://root:password@localhost:3306/auth_from_scratch")
      : z.string().url(),
    BASE_URL: isCI
      ? z.string().url().optional().default("http://localhost:3000")
      : z.string().url(),
    SESSION_SECRET: isCI
      ? z.string().optional().default("placeholder_value")
      : z.string().min(10),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
});
