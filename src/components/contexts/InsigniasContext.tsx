import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

import { supabase } from '@/components/supabase/client'

type Insignia = {
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

type MusicContextType = {
  insignias: Insignia[]
  setInsignias: Dispatch<SetStateAction<Insignia[]>>
  insigniasXUsuario: InsigniaXUsuario[]
  setInsigniasXUsuario: Dispatch<SetStateAction<InsigniaXUsuario[]>>
}

const InsigniasContext = createContext<MusicContextType | undefined>(undefined)

export function InsigniasProvider({ children }: { children: ReactNode }) {
  const [insignias, setInsignias] = useState<Insignia[]>([])
  const [insigniasXUsuario, setInsigniasXUsuario] = useState<
    InsigniaXUsuario[]
  >([])

  useEffect(() => {
    supabase
      .from('CapyInsignias')
      .select()
      .then(({ data }) => {
        console.log(data)
        setInsignias(data as Insignia[])
      })

    supabase
      .from('CapyInsigniasXUsuarios')
      .select()
      .then(({ data }) => {
        console.log(data)
        setInsigniasXUsuario(data as InsigniaXUsuario[])
      })
  }, [])

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
