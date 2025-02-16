import { env } from "@/lib/env"
import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [adminClient()],
})
