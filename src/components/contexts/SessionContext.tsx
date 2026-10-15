import type { Session } from '@supabase/supabase-js'
import { createContext, Fragment, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../supabase/client'

type SessionData = {
  session: Session | null
  setSession: React.Dispatch<Session | null>
}

export const SessionContext = createContext<SessionData | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [{ session, generation }, setAuth] = useState<{
    session: Session | null
    generation: number
  }>({ session: null, generation: 0 })

  const setSession = (nextSession: Session | null) => {
    setAuth(previous =>
      previous.generation !== generation
        ? previous
        : {
            session: nextSession,
            generation:
              previous.generation +
              (previous.session?.user.id !== nextSession?.user.id ? 1 : 0),
          }
    )
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuth(previous => ({
        session: event === 'SIGNED_OUT' ? null : session,
        // SIGNED_OUT también descarta el estado de una sesión invitada.
        generation:
          previous.generation +
          (event === 'SIGNED_OUT' ||
          previous.session?.user.id !== session?.user.id
            ? 1
            : 0),
      }))
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
      {/* Desmontar también las rutas invalida setters de requests anteriores
          y ejecuta el cleanup de los workers sin cambiar sus APIs. */}
      <Fragment key={generation}>{children}</Fragment>
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
