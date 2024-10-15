import type { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../supabase/client'

type SessionData = {
  session: Session | null
  setSession: React.Dispatch<Session | null>
}

export const SessionContext = createContext<SessionData | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') setSession(null)
      else setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
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
