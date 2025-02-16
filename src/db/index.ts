import { env } from "@/lib/env"
import { drizzle } from "drizzle-orm/libsql"

export const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
})
