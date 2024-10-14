import type { Session } from '@supabase/supabase-js'
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type SessionData = {
  session: Session | null
  setSession: React.Dispatch<Session | null>
}

export const SessionContext = createContext<SessionData | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
