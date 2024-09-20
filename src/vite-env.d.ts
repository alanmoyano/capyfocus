/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}
