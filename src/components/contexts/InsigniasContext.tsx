import type { Dispatch, ReactNode, SetStateAction } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'

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
  reloadInsignias: () => void
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

  const userId = session?.user.id
  const request = useRef(0)
  const mounted = useRef(false)

  const reloadInsignias = useCallback(() => {
    if (!userId || !mounted.current) return
    const currentRequest = ++request.current
    void supabase
      .from('CapyInsigniasXUsuarios')
      .select()
      .eq('idUsuario', userId)
      .then(({ data, error }) => {
        if (!mounted.current || currentRequest !== request.current) return
        if (error) {
          console.error(error)
          return
        }
        setInsigniasXUsuario(data as InsigniaXUsuario[])
      })
  }, [userId])

  useEffect(() => {
    let active = true
    mounted.current = true
    void supabase
      .from('CapyInsignias')
      .select()
      .then(({ data }) => {
        if (active && data) setInsignias(data as Insignia[])
      })
    reloadInsignias()
    return () => {
      active = false
      mounted.current = false
    }
  }, [reloadInsignias])

  return (
    <InsigniasContext.Provider
      value={{
        insignias,
        setInsignias,
        insigniasXUsuario,
        setInsigniasXUsuario,
        reloadInsignias,
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
