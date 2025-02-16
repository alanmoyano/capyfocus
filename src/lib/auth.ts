import { db } from "../db"
import { schema } from "@/db/schema"
import { env } from "./env"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  cookieCache: {
    enabled: true,
    maxAge: 60 * 5, // 5 min
  },
  plugins: [admin()],
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key)
      return value ? JSON.stringify(value) : null
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { ex: ttl })
      else await redis.set(key, value)
    },
    delete: async (key) => {
      await redis.del(key)
    },
  },
})

export type Session = typeof auth.$Infer.Session
