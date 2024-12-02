import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/components/supabase/client'
import { useSession } from './SessionContext'

export type Insignia = {
  id: number
  nombre: string
  descripcionBloqueada: string
  descripcionDesbloqueada: string
}

export type InsigniaXUsuario = {
  idInsignia: number
  idUsuario: string
  progreso: number
}

type InsigniasContextType = {
  insignias: Insignia[]
  setInsignias: Dispatch<SetStateAction<Insignia[]>>
  insigniasXUsuario: InsigniaXUsuario[]
  setInsigniasXUsuario: Dispatch<SetStateAction<InsigniaXUsuario[]>>
}

const InsigniasContext = createContext<InsigniasContextType | undefined>(
  undefined
)

export function InsigniasProvider({ children }: { children: ReactNode }) {
  const [insignias, setInsignias] = useState<Insignia[]>([])
  const [insigniasXUsuario, setInsigniasXUsuario] = useState<
    InsigniaXUsuario[]
  >([])

  const { session } = useSession()

  useEffect(() => {
    supabase
      .from('CapyInsignias')
      .select()
      .then(({ data }) => {
        console.log(data)
        setInsignias(data as Insignia[])
      })
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('CapyInsigniasXUsuarios')
      .select()
      .eq('idUsuario', session.user.id)
      .then(({ data }) => {
        console.log(data)
        if (!data) return
        setInsigniasXUsuario(data as InsigniaXUsuario[])
      })
  }, [session])

  return (
    <InsigniasContext.Provider
      value={{
        insignias,
        setInsignias,
        insigniasXUsuario,
        setInsigniasXUsuario,
      }}
    >
      {children}
    </InsigniasContext.Provider>
  )
}

export const useInsignias = () => {
  const context = useContext(InsigniasContext)
  if (context === undefined) {
    throw new Error('useInsignias must be used within a InsigniasProvider')
  }
  return context
}
