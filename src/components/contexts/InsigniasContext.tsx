import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from '@/components/supabase/client'
import { useSession } from './SessionContext'
import { useEvents } from '@/components/contexts/EventsContext'
import { Event } from '@/components/ComponentesEspecifico/Eventos'

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
  requisitosInsignias: typeof requisitosInsignias
  getProgresoInsignia: (
    idInsignia: number,
    datosNuevosInsignias: {
      sesionesNegativas: number
      sesionesPositivas: number
      tiempoEstudiado: number
      sesionesDeEstudio: number
      objetivosCumplidos: number
      objetivosSesion: number
    },
    events: Event[]
  ) => number
}

const InsigniasContext = createContext<InsigniasContextType | undefined>(
  undefined
)

const requisitosInsignias = {
  1: 25, // Estudiar 25 veces con pasivoAgresivo
  2: 25, // Estudiar 25 veces con positiva
  3: 1, // Alcanzar un evento
  4: 2, // Estudiar por 2 horas seguidas
  5: 10, // Acumular 10 horas para un evento
  6: 5, // Finalizar 5 sesiones de estudio
  7: 15, // Finalizar 15 sesiones de estudio
  8: 35, // Finalizar 35 sesiones de estudio
  9: 50, // Finalizar 50 sesiones de estudio
  10: 100, // Finalizar 100 sesiones de estudio
  11: 10, // Cumplir todos los objetivos de una sesión
  12: 35, // Completa 35 objetivos
  13: 75, // Completa 75 objetivos
  14: 100, // Completa 100 objetivos
  15: 30, // Pasa 30 días sin estudiar
}
function getProgresoInsignia(
  idInsignia: number,
  datosNuevosInsignias: {
    sesionesNegativas: number
    sesionesPositivas: number
    tiempoEstudiado: number
    sesionesDeEstudio: number
    objetivosCumplidos: number
    objetivosSesion: number
  },
  events: Event[]
) {
  switch (idInsignia) {
    case 1: {
      const porcentaje = Math.round(
        (datosNuevosInsignias.sesionesNegativas / requisitosInsignias[1]) * 100
      )

      console.log('porcentaje', porcentaje)

      return porcentaje > 100 ? 100 : porcentaje
    }

    case 2: {
      const porcentaje = Math.round(
        (datosNuevosInsignias.sesionesPositivas / requisitosInsignias[2]) * 100
      )

      return porcentaje > 100 ? 100 : porcentaje
    }

    case 3:
      return events.find(event => event.date.getTime() > new Date().getTime())
        ? 100
        : 0

    case 4:
      return datosNuevosInsignias.tiempoEstudiado > 2 * 60 * 60 ? 100 : 7

    case 6:
    case 7:
    case 8:
    case 9:
    case 10: {
      const porcentaje = Math.round(
        (datosNuevosInsignias.sesionesDeEstudio /
          requisitosInsignias[idInsignia]) *
          100
      )
      return porcentaje > 100 ? 100 : porcentaje
    }

    case 11:
      return datosNuevosInsignias.objetivosCumplidos >
        datosNuevosInsignias.objetivosSesion
        ? 100
        : 7

    case 12:
    case 13:
    case 14:
      return Math.round(
        (datosNuevosInsignias.objetivosCumplidos /
          requisitosInsignias[idInsignia]) *
          100
      )

    default:
      return 1
  }
}

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
    supabase
      .from('CapyInsigniasXUsuarios')
      .select()
      .eq('idUsuario', session?.user.id)
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
        requisitosInsignias,
        getProgresoInsignia,
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
