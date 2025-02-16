import { env } from "@/lib/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  schema: "./src/db/schema.ts",
  out: "./drizzle",
})
