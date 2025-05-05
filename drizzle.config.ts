import { env } from "@/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
